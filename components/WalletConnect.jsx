import React, { useState, useEffect } from 'react';

function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Simulate wallet connection (will be replaced with Privy)
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock wallet data
      setIsConnected(true);
      setAddress('0x742d35Cc6634C0532925a3b8D09A80C1f34Dd4f1');
      setChainId(8453); // Base chain ID
      
      localStorage.setItem('wallet_connected', 'true');
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    setChainId(null);
    localStorage.removeItem('wallet_connected');
  };

  // Check for existing connection
  useEffect(() => {
    const wasConnected = localStorage.getItem('wallet_connected');
    if (wasConnected) {
      setIsConnected(true);
      setAddress('0x742d35Cc6634C0532925a3b8D09A80C1f34Dd4f1');
      setChainId(8453);
    }
  }, []);

  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getChainName = (id) => {
    switch (id) {
      case 8453:
        return 'Base';
      case 1:
        return 'Ethereum';
      default:
        return 'Unknown';
    }
  };

  if (isConnected) {
    return (
      <div className="glass-morphism rounded-2xl p-6 border-2 border-pink-400/30 dog-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src="assets/dog-avatar-gaming.webp" 
                alt="Connected Wallet" 
                className="w-14 h-14 rounded-full border-3 border-pink-400 animate-pulse-glow"
              />
              <div className="absolute -top-1 -right-1 bg-green-400 rounded-full w-4 h-4 flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="text-white font-bold">{formatAddress(address)}</p>
                <span className="animate-bounce">🎮</span>
              </div>
              <p className="text-pink-400 text-sm font-medium flex items-center">
                <span className="mr-1">⛓️</span>
                {getChainName(chainId)} Network
              </p>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-all duration-300 transform hover:scale-105 border border-red-400/20"
          >
            <span className="mr-1">👋</span>
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="w-full glass-morphism rounded-2xl p-6 border-2 border-pink-400/30 hover:border-pink-400/60 transition-all duration-300 group dog-card transform hover:scale-105"
    >
      <div className="flex items-center justify-center space-x-4">
        {isConnecting ? (
          <>
            <div className="relative">
              <div className="loading-spinner-cute"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg animate-spin">🐕</span>
              </div>
            </div>
            <span className="text-gray-300 font-medium">Connecting...</span>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center group-hover:animate-bounce">
                <span className="text-white font-bold text-2xl">🐕</span>
              </div>
              <div className="absolute -top-1 -right-1 animate-pulse">
                <span className="text-lg">💖</span>
              </div>
            </div>
            <div className="text-center">
              <span className="text-white font-bold text-lg block">Connect Wallet</span>
              <span className="text-pink-400 text-sm">Join the pack!</span>
            </div>
          </>
        )}
      </div>
      <p className="text-gray-400 text-sm mt-3 text-center">
        🎮 Connect to start trading predictions with $UDOG 🚀
      </p>
    </button>
  );
}

window.WalletConnect = WalletConnect;