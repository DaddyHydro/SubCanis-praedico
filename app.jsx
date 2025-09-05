import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkDependencies = () => {
      if (
        window.Home &&
        window.PredictionMarket &&
        window.TokenBalance &&
        window.ActiveMarkets &&
        window.MarketData &&
        window.WalletConnect &&
        window.PrivyProvider &&
        window.UserProvider &&
        window.supabaseLib
      ) {
        setIsReady(true);
      }
    };

    checkDependencies();
    const interval = setInterval(checkDependencies, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="relative mb-8">
          <img 
            src="assets/subcanis-mascot.webp" 
            alt="SubCanis Mascot" 
            className="w-32 h-32 animate-bounce"
          />
          <div className="absolute -top-2 -right-2 animate-pulse">
            <span className="text-2xl">💖</span>
          </div>
        </div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mb-4"></div>
        <p className="text-gray-300 text-lg animate-pulse">Loading SubCanis Praedico...</p>
        <div className="mt-2 flex space-x-2">
          <span className="animate-bounce delay-0">🐕</span>
          <span className="animate-bounce delay-100">🎮</span>
          <span className="animate-bounce delay-200">💰</span>
        </div>
      </div>
    );
  }

  return React.createElement(
    window.PrivyProvider,
    {},
    React.createElement(
      window.UserProvider,
      {},
      React.createElement(window.Home)
    )
  );
}

createRoot(document.getElementById('renderDiv')).render(React.createElement(App));