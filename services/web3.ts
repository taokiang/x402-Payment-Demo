import { BrowserProvider, formatUnits, Signer } from 'ethers';
import { X402PaymentRequest } from '../types';

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

export class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: Signer | null = null;

  /**
   * Helper to get or initialize the provider lazily.
   * Checks for standard ethereum injection and legacy web3 injection.
   */
  private getProvider(): BrowserProvider | null {
    if (this.provider) return this.provider;

    if (typeof window !== 'undefined') {
      // 1. Standard EIP-1193 (MetaMask, etc.)
      if (window.ethereum) {
        this.provider = new BrowserProvider(window.ethereum);
        return this.provider;
      }
      // 2. Legacy Web3 object (older extensions)
      else if (window.web3?.currentProvider) {
        this.provider = new BrowserProvider(window.web3.currentProvider);
        return this.provider;
      }
    }
    return null;
  }

  async connectWallet(): Promise<string> {
    const provider = this.getProvider();
    
    if (!provider) {
      console.error("Window.ethereum is undefined. Available global keys:", Object.keys(window));
      throw new Error("No wallet found. Please ensure MetaMask is installed and enabled.");
    }

    try {
      // Request account access
      // Note: 'eth_requestAccounts' works for most wallets.
      await provider.send("eth_requestAccounts", []);
      this.signer = await provider.getSigner();
      return await this.signer.getAddress();
    } catch (error: any) {
      console.error("Error requesting accounts:", error);
      throw error;
    }
  }

  async getCurrentAddress(): Promise<string | null> {
    const provider = this.getProvider();
    if (!provider) return null;

    try {
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        this.signer = await provider.getSigner();
        return accounts[0];
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Executes the payment requested by the 402 response
   */
  async payRequest(req: X402PaymentRequest): Promise<string> {
    // Ensure we have a signer
    if (!this.signer) {
      await this.connectWallet();
    }
    if (!this.signer) throw new Error("Wallet not connected");

    console.log(`Sending ${req.amount} wei to ${req.recipient}`);

    // Send Transaction
    const tx = await this.signer.sendTransaction({
      to: req.recipient,
      value: req.amount, // Expecting value in wei string
    });

    console.log("Transaction sent:", tx.hash);

    // Wait for 1 confirmation
    await tx.wait(1);

    return tx.hash;
  }

  formatEth(wei: string): string {
    return formatUnits(wei, 18);
  }
}

export const web3Service = new Web3Service();