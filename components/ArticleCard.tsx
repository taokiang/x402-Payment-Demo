import React from 'react';
import { ProtectedContent } from '../types';

interface ArticleCardProps {
  content: ProtectedContent | null;
  isLocked: boolean;
  onUnlock: () => void;
  isLoading: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ content, isLocked, onUnlock, isLoading }) => {
  if (isLocked) {
    return (
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl mx-auto mt-12">
        {/* Blurred Content Placeholder */}
        <div className="p-8 filter blur-sm select-none opacity-50">
          <div className="h-8 bg-gray-300 w-3/4 mb-4 rounded"></div>
          <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 w-5/6 mb-2 rounded"></div>
          <div className="h-64 bg-gray-100 w-full mt-6 rounded"></div>
        </div>

        {/* Overlay Lock UI */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center max-w-sm w-full mx-4">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Content</h3>
            <p className="text-gray-500 mb-6 text-sm">
              This article is protected by the x402 protocol. Please unlock to read the full story.
            </p>
            <button
              onClick={onUnlock}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                "Unlock Access"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl mx-auto mt-12 animate-fade-in">
      <img src={content.imageUrl} alt={content.title} className="w-full h-64 object-cover" />
      <div className="p-8">
        <div className="flex items-center gap-2 mb-4">
           <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Unlocked</span>
           <span className="text-gray-400 text-xs">via x402</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{content.title}</h1>
        <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
          {content.body}
        </div>
      </div>
    </div>
  );
};