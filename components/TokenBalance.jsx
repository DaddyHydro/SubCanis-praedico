import React, { useState, useEffect } from 'react';

function TokenBalance() {
  const [balances, setBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser } = window.useUser();
  const { balancesApi } = window.supabaseLib;

  // Mock UDOG token price
  const udogPrice = 0.0234;

  const fetchBalances = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await balancesApi.getByUserId(currentUser.id);
      
      if (response.success) {
        setBalances(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch balances:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchBalances();
    } else {
      setBalances([]);
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleBuyTokens = async () => {
    if (!buyAmount || isNaN(buyAmount) || buyAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!currentUser) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);

      // Update USDC balance (simulate token purchase)
      await balancesApi.update({
        user_id: currentUser.id,
        token_symbol: 'USDC',
        amount: parseFloat(buyAmount),
        operation: 'add'
      });

      // Refresh balances
      await fetchBalances();

      setBuyAmount('');
      setShowBuyModal(false);
      
      // Show confetti effect
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      alert(`🎉 Successfully purchased ${buyAmount} $UDOG tokens! 🐕💰`);
    } catch (err) {
      console.error('Failed to buy tokens:', err);
      alert('Failed to purchase tokens. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBalance = (symbol) => {
    const balance = balances.find(b => b.token_symbol === symbol);
    return balance ? parseFloat(balance.balance) : 0;
  };

  const getTotalValue = () => {
    const udogBalance = getBalance('USDC'); // Using USDC as UDOG for now
    return udogBalance * udogPrice;
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

  if (!currentUser) {
    return (
      <div className="glass-morphism rounded-2xl p-6 border-2 border-gray-600/30 opacity-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🐕</span>
          </div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">Connect Wallet</h3>
          <p className="text-gray-500 text-sm">Connect your wallet to view your $UDOG balance</p>
        </div>
      </div>
    );
  }

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

  if (error) {
    return (
      <div className="glass-morphism rounded-2xl p-6 border-2 border-red-500/30">
        <div className="text-center">
          <span className="text-2xl mb-2 block">⚠️</span>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchBalances}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const udogBalance = getBalance('USDC'); // Using USDC as UDOG
  const usdValue = getTotalValue();

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
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full text-white font-bold hover:from-yellow-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 shadow-lg border-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">🛒</span>
            Buy More
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-4xl font-bold text-white animate-gradient bg-clip-text text-transparent">
            {formatBalance(udogBalance)} $UDOG
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
              {formatBalance(udogBalance)} $UDOG
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
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full text-white font-bold hover:from-yellow-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mr-2">🎉</span>
                  {isLoading ? 'Buying...' : 'Buy Tokens'}
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