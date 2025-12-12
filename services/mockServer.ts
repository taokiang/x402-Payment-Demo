import { X402PaymentRequest, ProtectedContent, ApiError } from '../types';

// In a real app, these would be env vars or database values
const MOCK_PREMIUM_CONTENT: ProtectedContent = {
  id: '1',
  title: 'The Future of Decentralized Payments',
  body: 'Congratulations! You have successfully unlocked this premium content using the x402 protocol. This demonstrates how HTTP 402 status codes can bridge the gap between web2 resources and web3 payments. By providing a transaction hash in the Authorization header, the server verified your on-chain payment without requiring a centralized payment processor.',
  imageUrl: 'https://picsum.photos/800/400'
};

const PAYMENT_DEMAND: X402PaymentRequest = {
  chainId: '0xaa36a7', // Sepolia (11155111). We will dynamically adjust this in the mock to match user for demo purposes, but normally server dictates chain.
  recipient: '0x000000000000000000000000000000000000dEaD', // Burn address for demo safety
  amount: '1000000000000', // 0.000001 ETH (Very small amount)
  currency: 'ETH',
  reason: 'Unlock Premium Article'
};

/**
 * Simulates a fetch to a protected endpoint.
 * @param authorizationHeader - The Authorization header string (e.g., "x402 <tx_hash>")
 */
export const fetchProtectedResource = async (authorizationHeader?: string): Promise<ProtectedContent> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // 1. Check if Authorization header exists and follows scheme
  if (!authorizationHeader || !authorizationHeader.startsWith('x402 ')) {
    throw create402Error();
  }

  // 2. Extract TxHash
  const txHash = authorizationHeader.split(' ')[1];

  if (!txHash || txHash.length !== 66) {
    // Invalid hash format
    throw create402Error();
  }

  // 3. (Mocking Server Logic) Verify Transaction
  // In a real backend, we would use ethers/web3 provider to check:
  // - Does tx exist?
  // - Is it confirmed?
  // - Is 'to' == PAYMENT_DEMAND.recipient?
  // - Is 'value' >= PAYMENT_DEMAND.amount?
  
  console.log(`[Mock Server] Verifying payment proof: ${txHash}`);
  
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return content
  return MOCK_PREMIUM_CONTENT;
};

const create402Error = (): ApiError => {
  const error = new Error('Payment Required') as ApiError;
  error.status = 402;
  // We attach the payment requirements to the error object to simulate
  // reading the 'WWW-Authenticate' or 'X-Payment-Request' header
  error.paymentRequest = PAYMENT_DEMAND; 
  return error;
};