export interface X402PaymentRequest {
  chainId: string; // Hex string, e.g., "0x1" or "0xaa36a7"
  recipient: string; // Wallet address
  amount: string; // Amount in WEI or native unit represented as string
  currency: string; // "ETH", "MATIC", etc.
  reason?: string; // Description of what is being purchased
}

export interface ProtectedContent {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
}

export interface ApiError extends Error {
  status: number;
  paymentRequest?: X402PaymentRequest;
}

export enum PaymentStatus {
  IDLE = 'IDLE',
  DETECTING_402 = 'DETECTING_402', // Analyzing server response
  AWAITING_USER = 'AWAITING_USER', // User needs to confirm in wallet
  PROCESSING_TX = 'PROCESSING_TX', // Transaction sent, waiting for mine
  VERIFYING = 'VERIFYING', // Sending proof back to server
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
