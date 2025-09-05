import React, { useState, useEffect } from 'react';

function ActiveMarkets() {
  const [userBets, setUserBets] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');

  useEffect(() => {
    // Mock user bets data
    const mockBets = [
      {
        id: 1,
        marketQuestion: "Will Bitcoin reach $100,000 by end of 2025?",
        outcome: "🚀 Yes",
        betAmount: 500,
        odds: 2.4,
        potentialPayout: 1200,
        status: "active",
        placedAt: "2024-12-15T10:30:00Z",
        deadline: "2025-12-31",
        mascot: "🐕‍🦺"
      },
      {
        id: 2,
        marketQuestion: "Will Ethereum 2.0 complete by Q3 2025?",
        outcome: "❌ No",
        betAmount: 250,
        odds: 3.2,
        potentialPayout: 800,
        status: "active",
        placedAt: "2024-12-10T14:20:00Z",
        deadline: "2025-09-30",
        mascot: "🐕‍💻"
      },
      {
        id: 3,
        marketQuestion: "Will Dogecoin reach $1 in 2024?",
        outcome: "🚀 Yes",
        betAmount: 1000,
        odds: 5.0,
        potentialPayout: 5000,
        status: "lost",
        placedAt: "2024-01-15T09:15:00Z",
        deadline: "2024-12-31",
        resolvedAt: "2024-12-31T23:59:59Z",
        mascot: "🐕‍💼"
      },
      {
        id: 4,
        marketQuestion: "Will Bitcoin dominance fall below 40% in 2024?",
        outcome: "❌ No",
        betAmount: 750,
        odds: 1.8,
        potentialPayout: 1350,
        status: "won",
        placedAt: "2024-06-01T16:45:00Z",
        deadline: "2024-12-31",
        resolvedAt: "2024-12-31T23:59:59Z",
        mascot: "🐕‍🎓"
      }
    ];

    setUserBets(mockBets);
  }, []);

  const filteredBets = userBets.filter(bet => {
    switch (selectedTab) {
      case 'active':
        return bet.status === 'active';
      case 'won':
        return bet.status === 'won';
      case 'lost':
        return bet.status === 'lost';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      case 'won':
        return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'lost':
        return 'text-red-400 bg-red-500/20 border-red-400/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return '⏳';
      case 'won':
        return '🎉';
      case 'lost':
        return '😢';
      default:
        return '❓';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateStats = () => {
    const totalBets = userBets.length;
    const wonBets = userBets.filter(bet => bet.status === 'won').length;
    const lostBets = userBets.filter(bet => bet.status === 'lost').length;
    const activeBets = userBets.filter(bet => bet.status === 'active').length;
    
    const totalWagered = userBets.reduce((sum, bet) => sum + bet.betAmount, 0);
    const totalWon = userBets.filter(bet => bet.status === 'won').reduce((sum, bet) => sum + bet.potentialPayout, 0);
    const totalLost = userBets.filter(bet => bet.status === 'lost').reduce((sum, bet) => sum + bet.betAmount, 0);
    
    const winRate = totalBets > 0 ? ((wonBets / (wonBets + lostBets)) * 100) : 0;
    const roi = totalWagered > 0 ? (((totalWon - totalLost) / totalWagered) * 100) : 0;

    return {
      totalBets,
      wonBets,
      lostBets,
      activeBets,
      totalWagered,
      totalWon,
      totalLost,
      winRate: isNaN(winRate) ? 0 : winRate,
      roi
    };
  };

  const stats = calculateStats();

  const tabs = [
    { id: 'active', label: 'Active', count: stats.activeBets, icon: '⚡', color: 'from-blue-500 to-purple-500' },
    { id: 'won', label: 'Won', count: stats.wonBets, icon: '🏆', color: 'from-green-500 to-teal-500' },
    { id: 'lost', label: 'Lost', count: stats.lostBets, icon: '💔', color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <span className="mr-3 animate-bounce">📊</span>
          My Portfolio
          <span className="ml-3 animate-bounce delay-100">🐕‍💼</span>
        </h2>
        <p className="text-gray-300">Track your prediction performance!</p>
        <div className="flex justify-center space-x-2 mt-2">
          <span className="animate-bounce delay-0">📈</span>
          <span className="animate-bounce delay-100">💖</span>
          <span className="animate-bounce delay-200">🎯</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-morphism rounded-2xl p-6 text-center border-2 border-purple-400/20 dog-card">
          <div className="text-3xl font-bold text-white mb-2">{stats.totalBets}</div>
          <p className="text-gray-400 text-sm flex items-center justify-center">
            <span className="mr-1">🎲</span>
            Total Bets
          </p>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center border-2 border-green-400/20 dog-card">
          <div className="text-3xl font-bold text-green-400 mb-2">{stats.winRate.toFixed(1)}%</div>
          <p className="text-gray-400 text-sm flex items-center justify-center">
            <span className="mr-1">🏆</span>
            Win Rate
          </p>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center border-2 border-blue-400/20 dog-card">
          <div className="text-3xl font-bold text-white mb-2">{formatAmount(stats.totalWagered)}</div>
          <p className="text-gray-400 text-sm flex items-center justify-center">
            <span className="mr-1">💰</span>
            Total Wagered
          </p>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center border-2 border-yellow-400/20 dog-card">
          <div className={`text-3xl font-bold mb-2 ${stats.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(1)}%
          </div>
          <p className="text-gray-400 text-sm flex items-center justify-center">
            <span className="mr-1">📊</span>
            ROI
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-morphism rounded-2xl p-8 dog-card animate-slide-in border-2 border-purple-400/30">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3 animate-bounce">📋</span>
          Your Predictions
          <span className="ml-3 animate-bounce delay-100">🎯</span>
        </h2>

        <div className="flex flex-wrap justify-center space-x-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 border-2 ${
                selectedTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg border-white/30`
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-gray-600/30'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="bg-black/20 px-3 py-1 rounded-full text-sm font-bold">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bets List */}
        {filteredBets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🐕‍💼</div>
            <p className="text-gray-400 mb-3 text-lg">No {selectedTab} predictions found</p>
            <p className="text-gray-500 text-sm flex items-center justify-center">
              <span className="mr-2">🎯</span>
              Start making predictions to see them here
              <span className="ml-2">🚀</span>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBets.map((bet) => (
              <div key={bet.id} className="bg-gradient-to-r from-black/20 to-purple-900/20 rounded-2xl p-6 border-2 border-gray-700/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-102 relative">
                {/* Mascot */}
                <div className="absolute top-4 right-4 text-2xl animate-pulse">
                  {bet.mascot}
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-8">
                    <h4 className="text-white font-bold mb-3 text-lg leading-tight">{bet.marketQuestion}</h4>
                    <div className="flex items-center space-x-4 text-sm mb-4">
                      <span className="text-gray-400 flex items-center">
                        <span className="mr-1">🎯</span>
                        Predicted:
                      </span>
                      <span className="text-yellow-400 font-bold text-base">{bet.outcome}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getStatusColor(bet.status)}`}>
                        {getStatusIcon(bet.status)} {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-600/30">
                    <p className="text-gray-400 mb-1 flex items-center justify-center">
                      <span className="mr-1">💰</span>
                      Bet Amount
                    </p>
                    <p className="text-white font-bold text-lg">{formatAmount(bet.betAmount)} $UDOG</p>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-600/30">
                    <p className="text-gray-400 mb-1 flex items-center justify-center">
                      <span className="mr-1">📊</span>
                      Odds
                    </p>
                    <p className="text-yellow-400 font-bold text-lg">{bet.odds}x</p>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-600/30">
                    <p className="text-gray-400 mb-1 flex items-center justify-center">
                      <span className="mr-1">🎁</span>
                      Potential Payout
                    </p>
                    <p className="text-green-400 font-bold text-lg">{formatAmount(bet.potentialPayout)} $UDOG</p>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-600/30">
                    <p className="text-gray-400 mb-1 flex items-center justify-center">
                      <span className="mr-1">⏰</span>
                      {bet.status === 'active' ? 'Deadline' : 'Resolved'}
                    </p>
                    <p className="text-white font-medium">
                      {new Date(bet.status === 'active' ? bet.deadline : bet.resolvedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-600/50">
                  <p className="text-gray-500 text-xs flex items-center">
                    <span className="mr-1">📅</span>
                    Placed on {new Date(bet.placedAt).toLocaleDateString()} at {new Date(bet.placedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

window.ActiveMarkets = ActiveMarkets;