import React from 'react';

interface NavBarProps {
  address: string | null;
  onConnect: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ address, onConnect }) => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600">x402</span>
            <span className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-0.5">Protocol Demo</span>
          </div>
          <div>
            {address ? (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700 font-mono">
                  {address.substring(0, 6)}...{address.substring(address.length - 4)}
                </span>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};