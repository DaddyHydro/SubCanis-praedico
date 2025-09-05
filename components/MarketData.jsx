import React, { useState, useEffect } from 'react';

function MarketData() {
  const [marketData, setMarketData] = useState(null);
  const [topCoins, setTopCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      
      // Fetch global market data
      const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
      const globalData = await globalResponse.json();
      
      // Fetch top 5 coins for compact display
      const coinsResponse = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h'
      );
      const coinsData = await coinsResponse.json();
      
      setMarketData(globalData.data);
      setTopCoins(coinsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatValue = (value, isPercentage = false, isCompact = false) => {
    if (isPercentage) {
      return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
    }
    
    if (isCompact) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 2,
      }).format(value);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

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
          <p className="text-gray-300 animate-pulse">Loading market data...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="glass-morphism rounded-2xl p-6 animate-pulse border-2 border-gray-600/30">
              <div className="w-48 h-6 bg-gray-600 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="w-16 h-3 bg-gray-700 rounded"></div>
                    </div>
                    <div className="w-20 h-4 bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
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
            onClick={fetchMarketData}
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
          <span className="mr-3 animate-bounce">📈</span>
          Market Data
          <span className="ml-3 animate-bounce delay-100">🐕‍💻</span>
        </h2>
        <p className="text-gray-300">Real-time crypto market insights!</p>
        <div className="flex justify-center space-x-2 mt-2">
          <span className="animate-bounce delay-0">💹</span>
          <span className="animate-bounce delay-100">💖</span>
          <span className="animate-bounce delay-200">🚀</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Global Market Stats */}
        <div className="glass-morphism rounded-2xl p-8 dog-card border-2 border-purple-400/30 relative">
          <div className="absolute top-4 right-4 text-2xl animate-pulse">🐕‍🎓</div>
          
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="mr-2 animate-bounce">🌍</span>
            Market Overview
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-black/20 to-purple-900/20 rounded-xl p-4 border border-gray-700/30">
              <p className="text-gray-400 mb-2 flex items-center">
                <span className="mr-2">💰</span>
                Total Market Cap
              </p>
              <p className="text-white font-bold text-2xl">
                {formatValue(marketData?.total_market_cap?.usd, false, true)}
              </p>
              <p className={`text-sm flex items-center ${marketData?.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <span className="mr-1">{marketData?.market_cap_change_percentage_24h_usd >= 0 ? '📈' : '📉'}</span>
                {formatValue(marketData?.market_cap_change_percentage_24h_usd, true)}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-black/20 to-orange-900/20 rounded-xl p-4 border border-gray-700/30">
              <p className="text-gray-400 mb-2 flex items-center">
                <span className="mr-2">👑</span>
                BTC Dominance
              </p>
              <p className="text-orange-400 font-bold text-2xl">
                {marketData?.market_cap_percentage?.btc?.toFixed(1)}%
              </p>
              <p className="text-gray-500 text-sm flex items-center">
                <span className="mr-1">🐕‍🦺</span>
                Bitcoin's Market Share
              </p>
            </div>
          </div>
        </div>

        {/* Top Cryptos */}
        <div className="glass-morphism rounded-2xl p-8 dog-card border-2 border-pink-400/30 relative">
          <div className="absolute top-4 right-4 text-2xl animate-pulse">🐕‍🚀</div>
          
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="mr-2 animate-bounce">🏆</span>
            Top Cryptos
          </h3>
          
          <div className="space-y-4">
            {topCoins.map((coin, index) => (
              <div key={coin.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-black/20 to-pink-900/20 rounded-xl border border-gray-700/30 hover:border-pink-400/50 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 font-mono text-sm w-6">#{index + 1}</span>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full border-2 border-pink-400/30"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div>
                    <p className="text-white font-bold text-sm">{coin.symbol.toUpperCase()}</p>
                    <p className="text-gray-400 text-xs">{formatValue(coin.current_price, false, true)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold flex items-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <span className="mr-1">{coin.price_change_percentage_24h >= 0 ? '📈' : '📉'}</span>
                    {formatValue(coin.price_change_percentage_24h, true)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.MarketData = MarketData;