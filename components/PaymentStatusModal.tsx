import React from 'react';
import { PaymentStatus, X402PaymentRequest } from '../types';
import { web3Service } from '../services/web3';

interface PaymentStatusModalProps {
  status: PaymentStatus;
  request: X402PaymentRequest | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({ status, request, onCancel, onConfirm }) => {
  if (status === PaymentStatus.IDLE || status === PaymentStatus.SUCCESS) return null;

  const isDetecting = status === PaymentStatus.DETECTING_402;
  const isAwaitingUser = status === PaymentStatus.AWAITING_USER;
  const isProcessing = status === PaymentStatus.PROCESSING_TX;
  const isVerifying = status === PaymentStatus.VERIFYING;
  const isError = status === PaymentStatus.ERROR;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {isDetecting && 'Contacting Server...'}
            {isAwaitingUser && 'Payment Required'}
            {isProcessing && 'Processing Transaction'}
            {isVerifying && 'Verifying Payment'}
            {isError && 'Error'}
          </h2>
        </div>

        {/* Content Body */}
        <div className="mb-8">
            {isDetecting && (
                <div className="flex flex-col items-center">
                    <div className="animate-pulse h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <p className="text-gray-500 text-sm">Negotiating protocol...</p>
                </div>
            )}

            {isAwaitingUser && request && (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-sm">Item</span>
                            <span className="font-medium text-gray-900">{request.reason}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-sm">Amount</span>
                            <span className="font-bold text-indigo-600 text-lg">
                                {web3Service.formatEth(request.amount)} {request.currency}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-gray-500 text-sm">Network</span>
                             <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">Testnet (Simulated)</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                        This is a demo. Please use a testnet wallet (e.g., Sepolia).
                    </p>
                </div>
            )}

            {(isProcessing || isVerifying) && (
                 <div className="flex flex-col items-center py-4">
                     <div className="relative w-16 h-16 mb-4">
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                     </div>
                     <p className="text-gray-600 text-sm font-medium">
                         {isProcessing ? 'Waiting for blockchain confirmation...' : 'Submitting proof to server...'}
                     </p>
                 </div>
            )}
            
            {isError && (
                <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
                    Something went wrong. Please check your wallet and try again.
                </div>
            )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {isAwaitingUser ? (
             <>
                <button 
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    Pay Now
                </button>
             </>
          ) : (
             <button 
                onClick={onCancel}
                disabled={isProcessing || isVerifying}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isError ? 'Close' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};