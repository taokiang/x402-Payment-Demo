import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar';
import { ArticleCard } from './components/ArticleCard';
import { PaymentStatusModal } from './components/PaymentStatusModal';
import { fetchProtectedResource } from './services/mockServer';
import { web3Service } from './services/web3';
import { PaymentStatus, ProtectedContent, X402PaymentRequest, ApiError } from './types';

const App: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [content, setContent] = useState<ProtectedContent | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<X402PaymentRequest | null>(null);
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  
  // Attempt to reconnect wallet on load
  useEffect(() => {
    web3Service.getCurrentAddress().then(addr => {
      if (addr) setUserAddress(addr);
    });
  }, []);

  const handleConnect = async () => {
    try {
      const addr = await web3Service.connectWallet();
      setUserAddress(addr);
    } catch (err: any) {
      console.error("Failed to connect wallet", err);
      // More descriptive error for the user
      alert(`Connection failed: ${err.message || "Unknown error"}. \nIf you just installed MetaMask, please refresh the page.`);
    }
  };

  const handleUnlockClick = async () => {
    setStatus(PaymentStatus.DETECTING_402);
    
    try {
      // 1. Initial Request (Expected to fail with 402)
      await fetchProtectedResource();
    } catch (error: any) {
      const apiError = error as ApiError;
      
      if (apiError.status === 402 && apiError.paymentRequest) {
        // 2. Catch 402 and store payment details
        setPaymentRequest(apiError.paymentRequest);
        setStatus(PaymentStatus.AWAITING_USER);
      } else {
        console.error("Unexpected error:", error);
        setStatus(PaymentStatus.ERROR);
      }
    }
  };

  const handlePaymentConfirm = async () => {
    if (!paymentRequest) return;
    
    try {
      // 3. User clicked Pay - Prompt Wallet
      setStatus(PaymentStatus.PROCESSING_TX);
      
      const txHash = await web3Service.payRequest(paymentRequest);
      
      // 4. Payment Sent - Verify with Server
      setStatus(PaymentStatus.VERIFYING);
      
      const authHeader = `x402 ${txHash}`;
      const unlockedContent = await fetchProtectedResource(authHeader);
      
      setContent(unlockedContent);
      setStatus(PaymentStatus.SUCCESS);
      
    } catch (error) {
      console.error("Payment flow failed", error);
      setStatus(PaymentStatus.ERROR);
    }
  };

  const handleCancel = () => {
    setStatus(PaymentStatus.IDLE);
    setPaymentRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <NavBar address={userAddress} onConnect={handleConnect} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
             Read Paywalled Content
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
             Experience the web without subscriptions. Pay-per-article using your crypto wallet and the x402 standard.
          </p>
        </div>

        <ArticleCard 
            content={content} 
            isLocked={status !== PaymentStatus.SUCCESS} 
            isLoading={status !== PaymentStatus.IDLE && status !== PaymentStatus.SUCCESS && status !== PaymentStatus.ERROR}
            onUnlock={handleUnlockClick}
        />
      </main>

      <PaymentStatusModal 
        status={status}
        request={paymentRequest}
        onCancel={handleCancel}
        onConfirm={handlePaymentConfirm}
      />

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
            <p>x402 Protocol Demo &bull; Built with React & Ethers.js</p>
        </div>
      </footer>
    </div>
  );
};

export default App;