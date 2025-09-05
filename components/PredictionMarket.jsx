import React, { useState, useEffect } from 'react';

function PredictionMarket() {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState('');

  // Mock prediction markets data
  useEffect(() => {
    const mockMarkets = [
      {
        id: 1,
        question: "Will Bitcoin reach $100,000 by end of 2025?",
        description: "Prediction on whether BTC will hit the $100k milestone before January 1, 2026",
        outcomes: [
          { id: 'yes', name: '🚀 Yes', odds: 2.4, pool: 5420 },
          { id: 'no', name: '📉 No', odds: 1.8, pool: 7230 }
        ],
        totalPool: 12650,
        deadline: "2025-12-31",
        category: "Bitcoin",
        status: "active",
        mascot: "🐕‍🦺"
      },
      {
        id: 2,
        question: "Will Ethereum 2.0 complete by Q3 2025?",
        description: "Market on whether ETH 2.0 upgrade will be fully implemented",
        outcomes: [
          { id: 'yes', name: '✅ Yes', odds: 1.6, pool: 8900 },
          { id: 'no', name: '❌ No', odds: 3.2, pool: 3100 }
        ],
        totalPool: 12000,
        deadline: "2025-09-30",
        category: "Ethereum",
        status: "active",
        mascot: "🐕‍💻"
      },
      {
        id: 3,
        question: "Will any altcoin flip Bitcoin by market cap in 2025?",
        description: "Prediction on whether any cryptocurrency will surpass Bitcoin's market capitalization",
        outcomes: [
          { id: 'yes', name: '🔄 Yes', odds: 4.5, pool: 2100 },
          { id: 'no', name: '👑 No', odds: 1.3, pool: 9800 }
        ],
        totalPool: 11900,
        deadline: "2025-12-31",
        category: "Market Cap",
        status: "active",
        mascot: "🐕‍🎓"
      }
    ];

    setMarkets(mockMarkets);
  }, []);

  const placeBet = () => {
    if (!selectedMarket || !selectedOutcome || !betAmount || isNaN(betAmount) || betAmount <= 0) {
      alert('Please fill in all fields with valid values! 🐕');
      return;
    }

    // Simulate bet placement
    alert(`🎉 Bet placed! ${betAmount} $UDOG on "${selectedOutcome}" for market: ${selectedMarket.question} 🚀🐕`);
    
    // Reset form
    setSelectedMarket(null);
    setSelectedOutcome('');
    setBetAmount('');
  };

  const formatPool = (amount) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const getOddsColor = (odds) => {
    if (odds >= 3) return 'text-red-400';
    if (odds >= 2) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'resolved': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Bitcoin': return 'from-orange-500 to-yellow-500';
      case 'Ethereum': return 'from-blue-500 to-purple-500';
      case 'Market Cap': return 'from-pink-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {markets.map((market) => (
          <div key={market.id} className="glass-morphism rounded-2xl p-6 dog-card border-2 border-purple-400/30 relative overflow-hidden transform hover:scale-105 transition-all duration-300">
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 text-2xl animate-pulse">
              {market.mascot}
            </div>
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-pink-400/30 rounded-full animate-ping"></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(market.category)} text-white text-xs rounded-full font-bold animate-pulse-glow`}>
                    {market.category}
                  </span>
                  <span className={`text-xs uppercase font-bold ${getStatusColor(market.status)} flex items-center`}>
                    <span className="mr-1">⚡</span>
                    {market.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 leading-tight">{market.question}</h3>
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
                  {formatPool(market.totalPool)} $UDOG
                  <span className="ml-1 animate-bounce">🦴</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 flex items-center">
                  <span className="mr-1">⏰</span>
                  Deadline:
                </span>
                <span className="text-white font-medium">{new Date(market.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {market.outcomes.map((outcome) => (
                <div key={outcome.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-black/20 to-purple-900/20 rounded-xl border border-gray-700/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-102">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-lg">{outcome.name}</span>
                      <span className={`font-bold text-xl ${getOddsColor(outcome.odds)} animate-pulse`}>
                        {outcome.odds}x
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <span className="mr-1">🎯</span>
                      Pool: {formatPool(outcome.pool)} $UDOG
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedMarket(market)}
              className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full text-white font-bold hover:from-indigo-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-white/20"
            >
              <span className="mr-2 animate-bounce">🎲</span>
              Place Bet
              <span className="ml-2 animate-bounce">🚀</span>
            </button>
          </div>
        ))}
      </div>

      {/* Betting Modal */}
      {selectedMarket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-morphism rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-purple-400/30 dog-card relative">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-2xl animate-bounce">
              {selectedMarket.mascot}
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
                <h4 className="text-white font-bold mb-2">{selectedMarket.question}</h4>
                <p className="text-gray-400 text-sm">{selectedMarket.description}</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  Select Outcome
                </label>
                <div className="space-y-3">
                  {selectedMarket.outcomes.map((outcome) => (
                    <label key={outcome.id} className="flex items-center space-x-3 cursor-pointer p-3 bg-black/20 rounded-xl border border-gray-700/30 hover:border-purple-400/50 transition-all duration-300">
                      <input
                        type="radio"
                        name="outcome"
                        value={outcome.id}
                        checked={selectedOutcome === outcome.id}
                        onChange={(e) => setSelectedOutcome(e.target.value)}
                        className="text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-white font-medium text-lg flex-1">{outcome.name}</span>
                      <span className={`ml-auto font-bold text-xl ${getOddsColor(outcome.odds)} animate-pulse`}>
                        {outcome.odds}x
                      </span>
                    </label>
                  ))}
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
                      <span className="mr-1">🎁</span>
                      Potential Payout:
                    </span>
                    <span className="text-green-400 font-bold flex items-center">
                      {(betAmount * selectedMarket.outcomes.find(o => o.id === selectedOutcome)?.odds || 0).toFixed(2)} $UDOG
                      <span className="ml-1">🚀</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center">
                      <span className="mr-1">💸</span>
                      Potential Profit:
                    </span>
                    <span className="text-yellow-400 font-bold flex items-center">
                      {((betAmount * selectedMarket.outcomes.find(o => o.id === selectedOutcome)?.odds || 0) - betAmount).toFixed(2)} $UDOG
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span className="mr-2">🎉</span>
                  Place Bet
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