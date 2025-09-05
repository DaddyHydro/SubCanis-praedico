import React, { useState, useEffect } from 'react';

function TokenBalance() {
  const [balance, setBalance] = useState(0);
  const [usdValue, setUsdValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Mock UDOG token price (will be dynamic in production)
  const udogPrice = 0.0234;

  useEffect(() => {
    // Simulate loading user balance
    const loadBalance = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock balance (will be fetched from blockchain)
      const mockBalance = 15420.75;
      setBalance(mockBalance);
      setUsdValue(mockBalance * udogPrice);
      setIsLoading(false);
    };

    loadBalance();
  }, []);

  const handleBuyTokens = () => {
    if (!buyAmount || isNaN(buyAmount) || buyAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Simulate token purchase
    const purchaseAmount = parseFloat(buyAmount);
    const newBalance = balance + purchaseAmount;
    setBalance(newBalance);
    setUsdValue(newBalance * udogPrice);
    setBuyAmount('');
    setShowBuyModal(false);
    
    // Show confetti effect
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    // Show success message
    alert(`🎉 Successfully purchased ${purchaseAmount} $UDOG tokens! 🐕💰`);
  };

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatUSD = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="glass-morphism rounded-2xl p-6 animate-pulse border-2 border-yellow-400/30">
        <div className="flex items-center justify-between mb-4">
          <div className="w-32 h-6 bg-gray-600 rounded-full"></div>
          <div className="w-20 h-8 bg-gray-600 rounded-full"></div>
        </div>
        <div className="w-24 h-4 bg-gray-700 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-morphism rounded-2xl p-6 dog-card border-2 border-yellow-400/30 relative overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="confetti">🎉</div>
            <div className="confetti">🐕</div>
            <div className="confetti">💰</div>
            <div className="confetti">⭐</div>
            <div className="confetti">💖</div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold text-2xl">🐕</span>
              </div>
              <div className="absolute -top-1 -right-1 animate-bounce">
                <span className="text-lg">💰</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center">
                $UDOG Balance
                <span className="ml-2 animate-bounce">🦴</span>
              </h3>
              <p className="text-yellow-400 text-sm font-medium">Platform Token</p>
            </div>
          </div>
          <button
            onClick={() => setShowBuyModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full text-white font-bold hover:from-yellow-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 shadow-lg border-2 border-white/20"
          >
            <span className="mr-2">🛒</span>
            Buy More
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-4xl font-bold text-white animate-gradient bg-clip-text text-transparent">
            {formatBalance(balance)} $UDOG
          </div>
          <div className="text-gray-300 flex items-center text-lg">
            <span className="mr-2">💵</span>
            ≈ {formatUSD(usdValue)} USD
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <span className="mr-2">📊</span>
            Token Price: {formatUSD(udogPrice)}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center">
              <span className="mr-1">✨</span>
              Available for Trading:
            </span>
            <span className="text-green-400 font-bold flex items-center">
              {formatBalance(balance)} $UDOG
              <span className="ml-1">🚀</span>
            </span>
          </div>
        </div>
      </div>

      {/* Buy Tokens Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-morphism rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-pink-400/30 dog-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl animate-bounce">🛒</span>
                <h3 className="text-xl font-bold text-white">Buy $UDOG Tokens</h3>
              </div>
              <button
                onClick={() => setShowBuyModal(false)}
                className="text-gray-400 hover:text-white transform hover:scale-110 transition-all"
              >
                <span className="text-xl">❌</span>
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
                <span className="text-3xl">🐕</span>
              </div>
              <p className="text-gray-300">Get more $UDOG tokens to place bigger bets!</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-3 flex items-center">
                  <span className="mr-2">💰</span>
                  Amount ($UDOG)
                </label>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="w-full bg-black/20 border-2 border-yellow-400/30 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 transition-colors text-center text-lg font-bold"
                  placeholder="Enter amount to buy"
                  min="0"
                  step="any"
                />
              </div>

              {buyAmount && !isNaN(buyAmount) && buyAmount > 0 && (
                <div className="bg-black/20 rounded-2xl p-4 border border-gray-600/30">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400 flex items-center">
                      <span className="mr-1">💵</span>Cost:
                    </span>
                    <span className="text-white font-bold">{formatUSD(buyAmount * udogPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <span className="mr-1">🎁</span>You'll receive:
                    </span>
                    <span className="text-yellow-400 font-bold flex items-center">
                      {formatBalance(parseFloat(buyAmount))} $UDOG
                      <span className="ml-1">🚀</span>
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-600/20 text-gray-400 rounded-full hover:bg-gray-600/30 transition-colors font-medium border border-gray-600/30"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyTokens}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full text-white font-bold hover:from-yellow-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span className="mr-2">🎉</span>
                  Buy Tokens
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

window.TokenBalance = TokenBalance;