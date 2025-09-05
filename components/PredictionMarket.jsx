import React, { useState, useEffect } from 'react';

function PredictionMarket() {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = window.useUser();
  const { marketsApi, positionsApi, transactionsApi, balancesApi } = window.supabaseLib;

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await marketsApi.getAll({ status: 'active' });
      
      if (response.success) {
        setMarkets(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch markets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const placeBet = async () => {
    if (!selectedMarket || !selectedOutcome || !betAmount || isNaN(betAmount) || betAmount <= 0) {
      alert('Please fill in all fields with valid values! 🐕');
      return;
    }

    if (!currentUser) {
      alert('Please connect your wallet first! 🦴');
      return;
    }

    try {
      setLoading(true);

      const betAmountNum = parseFloat(betAmount);

      // Check user balance
      const balanceResponse = await balancesApi.getByUserId(currentUser.id);
      const userBalance = balanceResponse.success ? 
        balanceResponse.data.find(b => b.token_symbol === 'USDC')?.balance || 0 : 0;

      if (parseFloat(userBalance) < betAmountNum) {
        alert('Insufficient balance! Please buy more tokens. 💰');
        return;
      }

      // Create position
      const positionData = {
        user_id: currentUser.id,
        market_id: selectedMarket.id,
        side: selectedOutcome,
        shares: betAmountNum.toString(),
        price: selectedOutcome === 'yes' ? selectedMarket.yes_price || '0.5' : selectedMarket.no_price || '0.5'
      };

      const positionResponse = await positionsApi.create(positionData);

      if (positionResponse.success) {
        // Create transaction record
        const transactionData = {
          user_id: currentUser.id,
          market_id: selectedMarket.id,
          position_id: positionResponse.data.id,
          type: 'buy',
          side: selectedOutcome,
          shares: betAmountNum.toString(),
          price: positionData.price,
          total_amount: (betAmountNum * parseFloat(positionData.price)).toString(),
          tx_hash: `0x${Math.random().toString(16).slice(2, 42)}`
        };

        await transactionsApi.create(transactionData);

        // Update user balance
        await balancesApi.update({
          user_id: currentUser.id,
          token_symbol: 'USDC',
          amount: betAmountNum,
          operation: 'subtract'
        });

        alert(`🎉 Bet placed successfully! ${betAmount} $UDOG on "${selectedOutcome}" for: ${selectedMarket.title} 🚀🐕`);
        
        // Reset form and refresh markets
        setSelectedMarket(null);
        setSelectedOutcome('');
        setBetAmount('');
        await fetchMarkets();
      }
    } catch (err) {
      console.error('Failed to place bet:', err);
      alert('Failed to place bet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPool = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(parseFloat(amount));
  };

  const getOddsColor = (price) => {
    const priceNum = parseFloat(price || 0.5);
    if (priceNum >= 0.7) return 'text-red-400';
    if (priceNum >= 0.4) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (loading && markets.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="relative mb-6">
            <img 
              src="assets/subcanis-mascot.webp" 
              alt="Loading" 
              className="w-16 h-16 mx-auto animate-bounce"
            />
            <div className="absolute -top-1 -right-1 animate-pulse">
              <span className="text-xl">🎯</span>
            </div>
          </div>
          <p className="text-gray-300 animate-pulse">Loading prediction markets...</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-morphism rounded-2xl p-6 animate-pulse border-2 border-gray-600/30">
              <div className="w-48 h-6 bg-gray-600 rounded mb-4"></div>
              <div className="w-full h-16 bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2].map((j) => (
                  <div key={j} className="w-full h-12 bg-gray-600 rounded"></div>
                ))}
              </div>
              <div className="w-full h-12 bg-gray-600 rounded mt-6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🐕‍💻</div>
        <div className="glass-morphism rounded-2xl p-8 border-2 border-red-500/30 max-w-md mx-auto">
          <p className="text-red-400 mb-6 text-lg flex items-center justify-center">
            <span className="mr-2">⚠️</span>
            {error}
            <span className="ml-2">😢</span>
          </p>
          <button
            onClick={fetchMarkets}
            className="px-6 py-3 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-all duration-300 transform hover:scale-105 font-bold border-2 border-red-400/30"
          >
            <span className="mr-2">🔄</span>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <span className="mr-3 animate-bounce">🎯</span>
          Prediction Markets
          <span className="ml-3 animate-bounce delay-100">🎮</span>
        </h2>
        <p className="text-gray-300">Make predictions and earn $UDOG rewards!</p>
        <div className="flex justify-center space-x-2 mt-2">
          <span className="animate-bounce delay-0">🐕</span>
          <span className="animate-bounce delay-100">💖</span>
          <span className="animate-bounce delay-200">🚀</span>
        </div>
      </div>

      {/* Market Cards */}
      {markets.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📊</div>
          <div className="glass-morphism rounded-2xl p-8 border-2 border-gray-600/30 max-w-md mx-auto">
            <p className="text-gray-400 mb-4 text-lg">No active markets found</p>
            <p className="text-gray-500 text-sm flex items-center justify-center">
              <span className="mr-2">🔄</span>
              New markets coming soon!
              <span className="ml-2">🚀</span>
            </p>
            <button
              onClick={fetchMarkets}
              className="mt-4 px-6 py-3 bg-purple-500/20 text-purple-400 rounded-full hover:bg-purple-500/30 transition-all duration-300 transform hover:scale-105 font-bold border-2 border-purple-400/30"
            >
              <span className="mr-2">🔄</span>
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {markets.map((market) => (
            <div key={market.id} className="glass-morphism rounded-2xl p-6 dog-card border-2 border-purple-400/30 relative overflow-hidden transform hover:scale-105 transition-all duration-300">
              {/* Decorative elements */}
              <div className="absolute top-2 right-2 text-2xl animate-pulse">
                🐕‍🦺
              </div>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-pink-400/30 rounded-full animate-ping"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-bold animate-pulse-glow">
                      {market.category || 'Crypto'}
                    </span>
                    <span className="text-xs uppercase font-bold text-green-400 flex items-center">
                      <span className="mr-1">⚡</span>
                      {market.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 leading-tight">{market.title}</h3>
                  <p className="text-gray-400 text-sm">{market.description}</p>
                </div>
              </div>

              <div className="mb-4 bg-black/20 rounded-xl p-3 border border-gray-700/30">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400 flex items-center">
                    <span className="mr-1">💰</span>
                    Total Pool:
                  </span>
                  <span className="text-white font-bold flex items-center">
                    {formatPool(market.total_volume)} $UDOG
                    <span className="ml-1 animate-bounce">🦴</span>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 flex items-center">
                    <span className="mr-1">⏰</span>
                    Deadline:
                  </span>
                  <span className="text-white font-medium">
                    {market.deadline ? new Date(market.deadline).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-black/20 to-green-900/20 rounded-xl border border-gray-700/30 hover:border-green-400/50 transition-all duration-300 transform hover:scale-102">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-lg">🚀 Yes</span>
                      <span className={`font-bold text-xl ${getOddsColor(market.yes_price)} animate-pulse`}>
                        ${parseFloat(market.yes_price || 0.5).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <span className="mr-1">🎯</span>
                      Current Price
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-black/20 to-red-900/20 rounded-xl border border-gray-700/30 hover:border-red-400/50 transition-all duration-300 transform hover:scale-102">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-lg">❌ No</span>
                      <span className={`font-bold text-xl ${getOddsColor(market.no_price)} animate-pulse`}>
                        ${parseFloat(market.no_price || 0.5).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <span className="mr-1">🎯</span>
                      Current Price
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMarket(market)}
                disabled={!currentUser || loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full text-white font-bold hover:from-indigo-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-2 animate-bounce">🎲</span>
                {!currentUser ? 'Connect Wallet' : 'Place Bet'}
                <span className="ml-2 animate-bounce">🚀</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Betting Modal */}
      {selectedMarket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-morphism rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-purple-400/30 dog-card relative">
            <div className="absolute top-4 right-4 text-2xl animate-bounce">
              🐕‍🦺
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl animate-bounce">🎲</span>
                <h3 className="text-xl font-bold text-white">Place Your Bet</h3>
              </div>
              <button
                onClick={() => setSelectedMarket(null)}
                className="text-gray-400 hover:text-white transform hover:scale-110 transition-all"
              >
                <span className="text-xl">❌</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-white font-bold mb-2">{selectedMarket.title}</h4>
                <p className="text-gray-400 text-sm">{selectedMarket.description}</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  Select Outcome
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 bg-black/20 rounded-xl border border-gray-700/30 hover:border-green-400/50 transition-all duration-300">
                    <input
                      type="radio"
                      name="outcome"
                      value="yes"
                      checked={selectedOutcome === 'yes'}
                      onChange={(e) => setSelectedOutcome(e.target.value)}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <span className="text-white font-medium text-lg flex-1">🚀 Yes</span>
                    <span className="ml-auto font-bold text-xl text-green-400 animate-pulse">
                      ${parseFloat(selectedMarket.yes_price || 0.5).toFixed(2)}
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer p-3 bg-black/20 rounded-xl border border-gray-700/30 hover:border-red-400/50 transition-all duration-300">
                    <input
                      type="radio"
                      name="outcome"
                      value="no"
                      checked={selectedOutcome === 'no'}
                      onChange={(e) => setSelectedOutcome(e.target.value)}
                      className="text-red-500 focus:ring-red-500"
                    />
                    <span className="text-white font-medium text-lg flex-1">❌ No</span>
                    <span className="ml-auto font-bold text-xl text-red-400 animate-pulse">
                      ${parseFloat(selectedMarket.no_price || 0.5).toFixed(2)}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-3 flex items-center">
                  <span className="mr-2">💰</span>
                  Bet Amount ($UDOG)
                </label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full bg-black/20 border-2 border-purple-400/30 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors text-center text-lg font-bold"
                  placeholder="Enter bet amount"
                  min="0"
                  step="any"
                />
              </div>

              {betAmount && selectedOutcome && !isNaN(betAmount) && betAmount > 0 && (
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-4 border border-purple-400/30">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400 flex items-center">
                      <span className="mr-1">💵</span>
                      Cost:
                    </span>
                    <span className="text-white font-bold">
                      {(parseFloat(betAmount) * parseFloat(selectedMarket[`${selectedOutcome}_price`] || 0.5)).toFixed(2)} $UDOG
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <span className="mr-1">🎁</span>
                      Potential Payout:
                    </span>
                    <span className="text-green-400 font-bold flex items-center">
                      {betAmount} shares
                      <span className="ml-1 animate-bounce">💰</span>
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedMarket(null)}
                  className="flex-1 px-6 py-3 bg-gray-600/20 text-gray-400 rounded-full hover:bg-gray-600/30 transition-colors font-medium border border-gray-600/30"
                >
                  Cancel
                </button>
                <button
                  onClick={placeBet}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="mr-2">🎉</span>
                  {loading ? 'Placing...' : 'Place Bet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.PredictionMarket = PredictionMarket;