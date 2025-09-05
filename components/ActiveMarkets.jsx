import React, { useState, useEffect } from 'react';

function ActiveMarkets() {
  const [userPositions, setUserPositions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = window.useUser();
  const { positionsApi, transactionsApi } = window.supabaseLib;

  const fetchUserPositions = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await positionsApi.getAll({ user_id: currentUser.id });
      
      if (response.success) {
        setUserPositions(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch positions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserPositions();
    } else {
      setUserPositions([]);
      setLoading(false);
    }
  }, [currentUser]);

  const filteredPositions = userPositions.filter(position => {
    switch (selectedTab) {
      case 'active':
        return position.status === 'open';
      case 'won':
        return position.status === 'won';
      case 'lost':
        return position.status === 'lost';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
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
      case 'open':
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
    }).format(parseFloat(amount || 0));
  };

  const calculateStats = () => {
    const totalPositions = userPositions.length;
    const wonPositions = userPositions.filter(p => p.status === 'won').length;
    const lostPositions = userPositions.filter(p => p.status === 'lost').length;
    const activePositions = userPositions.filter(p => p.status === 'open').length;
    
    const totalWagered = userPositions.reduce((sum, p) => sum + parseFloat(p.total_cost || 0), 0);
    const totalWon = userPositions.filter(p => p.status === 'won').reduce((sum, p) => sum + parseFloat(p.current_value || 0), 0);
    const totalLost = userPositions.filter(p => p.status === 'lost').reduce((sum, p) => sum + parseFloat(p.total_cost || 0), 0);
    
    const winRate = totalPositions > 0 ? ((wonPositions / (wonPositions + lostPositions)) * 100) : 0;
    const roi = totalWagered > 0 ? (((totalWon - totalLost) / totalWagered) * 100) : 0;

    return {
      totalPositions,
      wonPositions,
      lostPositions,
      activePositions,
      totalWagered,
      totalWon,
      totalLost,
      winRate: isNaN(winRate) ? 0 : winRate,
      roi
    };
  };

  const stats = calculateStats();

  const tabs = [
    { id: 'active', label: 'Active', count: stats.activePositions, icon: '⚡', color: 'from-blue-500 to-purple-500' },
    { id: 'won', label: 'Won', count: stats.wonPositions, icon: '🏆', color: 'from-green-500 to-teal-500' },
    { id: 'lost', label: 'Lost', count: stats.lostPositions, icon: '💔', color: 'from-red-500 to-pink-500' },
  ];

  if (!currentUser) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
            <span className="mr-3 animate-bounce">📊</span>
            My Portfolio
            <span className="ml-3 animate-bounce delay-100">🐕‍💼</span>
          </h2>
          <div className="glass-morphism rounded-2xl p-16 border-2 border-gray-600/30 max-w-md mx-auto opacity-50">
            <div className="text-6xl mb-6">🐕‍💼</div>
            <p className="text-gray-400 mb-4 text-lg">Connect your wallet</p>
            <p className="text-gray-500 text-sm">
              Connect your wallet to view your prediction portfolio
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="relative mb-6">
            <img 
              src="assets/dog-avatar-gaming.webp" 
              alt="Loading" 
              className="w-16 h-16 mx-auto animate-bounce"
            />
            <div className="absolute -top-1 -right-1 animate-pulse">
              <span className="text-xl">📊</span>
            </div>
          </div>
          <p className="text-gray-300 animate-pulse">Loading your portfolio...</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-morphism rounded-2xl p-6 animate-pulse border-2 border-gray-600/30">
              <div className="w-16 h-8 bg-gray-600 rounded mb-2"></div>
              <div className="w-24 h-4 bg-gray-700 rounded"></div>
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
            onClick={fetchUserPositions}
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
          <div className="text-3xl font-bold text-white mb-2">{stats.totalPositions}</div>
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

        {/* Positions List */}
        {filteredPositions.length === 0 ? (
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
            {filteredPositions.map((position) => (
              <div key={position.id} className="bg-gradient-to-r from-black/20 to-purple-900/20 rounded-2xl p-6 border-2 border-gray-700/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-102 relative">
                {/* Status */}
                <div className="absolute top-4 right-4 text-2xl animate-pulse">
                  🐕‍🦺
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-8">
                    <h4 className="text-white font-bold mb-3 text-lg leading-tight">
                      {position.market?.title || 'Market Title'}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm mb-4">
                      <span className="text-gray-400 flex items-center">
                        <span className="mr-1">🎯</span>
                        Predicted:
                      </span>
                      <span className="text-yellow-400 font-bold text-base">
                        {position.side === 'yes' ? '🚀 Yes' : '❌ No'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getStatusColor(position.status)}`}>
                        {getStatusIcon(position.status)} {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-600/30">
                    <p className="text-gray-400 mb-1 flex items-center justify-center">
                      <span className="mr-1">📊</span>
                      Shares
                    </p>
                    <p className="text-white font-bold text-lg">{formatAmount(position.shares)}</p>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-600/30">
                    <p className="text-gray-400 mb-1 flex items-center justify-center">
                      <span className="mr-1">💰</span>
                      Avg Price
                    </p>
                    <p className="text-yellow-400 font-bold text-lg">${parseFloat(position.avg_price || 0).toFixed(2)}</p>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-600/30">
                    <p className="text-gray-400 mb-1 flex items-center justify-center">
                      <span className="mr-1">💵</span>
                      Total Cost
                    </p>
                    <p className="text-white font-bold text-lg">{formatAmount(position.total_cost)} $UDOG</p>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-600/30">
                    <p className="text-gray-400 mb-1 flex items-center justify-center">
                      <span className="mr-1">📈</span>
                      Current Value
                    </p>
                    <p className="text-green-400 font-bold text-lg">{formatAmount(position.current_value)} $UDOG</p>
                  </div>
                </div>

                {position.unrealized_pnl && (
                  <div className="mt-4 pt-4 border-t border-gray-600/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center">
                        <span className="mr-1">📊</span>
                        Unrealized P&L:
                      </span>
                      <span className={`font-bold ${parseFloat(position.unrealized_pnl) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {parseFloat(position.unrealized_pnl) >= 0 ? '+' : ''}{formatAmount(position.unrealized_pnl)} $UDOG
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-600/50">
                  <p className="text-gray-500 text-xs flex items-center">
                    <span className="mr-1">📅</span>
                    Position created: {new Date(position.created_at).toLocaleDateString()}
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