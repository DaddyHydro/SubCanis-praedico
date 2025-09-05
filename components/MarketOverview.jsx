import React, { useState, useEffect } from 'react';

function MarketOverview() {
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
      
      // Fetch top 10 coins
      const coinsResponse = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
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
      <div className="space-y-6">
        {/* Global Stats Loading */}
        <div className="glass-morphism rounded-xl p-6 animate-pulse">
          <div className="w-48 h-6 bg-gray-600 rounded mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-4 bg-gray-600 rounded mb-2 mx-auto"></div>
                <div className="w-16 h-6 bg-gray-700 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Coins Loading */}
        <div className="glass-morphism rounded-xl p-6 animate-pulse">
          <div className="w-32 h-6 bg-gray-600 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-morphism rounded-xl p-6 border-red-500/30">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchMarketData}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Market Stats */}
      <div className="glass-morphism rounded-xl p-6 crypto-card animate-slide-in">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] mb-6">
          📊 Global Market Overview
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Total Market Cap</p>
            <p className="text-2xl font-bold text-white">
              {formatValue(marketData?.total_market_cap?.usd, false, true)}
            </p>
            <p className={`text-sm ${marketData?.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatValue(marketData?.market_cap_change_percentage_24h_usd, true)}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">24h Trading Volume</p>
            <p className="text-2xl font-bold text-white">
              {formatValue(marketData?.total_volume?.usd, false, true)}
            </p>
            <p className="text-gray-400 text-xs">Total Volume</p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Bitcoin Dominance</p>
            <p className="text-2xl font-bold text-orange-400">
              {marketData?.market_cap_percentage?.btc?.toFixed(1)}%
            </p>
            <p className="text-gray-400 text-xs">BTC Dominance</p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Active Cryptocurrencies</p>
            <p className="text-2xl font-bold text-white">
              {marketData?.active_cryptocurrencies?.toLocaleString()}
            </p>
            <p className="text-gray-400 text-xs">Active Coins</p>
          </div>
        </div>
      </div>

      {/* Top 10 Cryptocurrencies */}
      <div className="glass-morphism rounded-xl p-6 crypto-card animate-slide-in">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] mb-6">
          🏆 Top 10 Cryptocurrencies
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-2 text-gray-400 text-sm">Rank</th>
                <th className="text-left py-3 px-2 text-gray-400 text-sm">Coin</th>
                <th className="text-right py-3 px-2 text-gray-400 text-sm">Price</th>
                <th className="text-right py-3 px-2 text-gray-400 text-sm">24h Change</th>
                <th className="text-right py-3 px-2 text-gray-400 text-sm">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {topCoins.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-2">
                    <span className="text-gray-400 font-mono">#{coin.market_cap_rank}</span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-white">{coin.name}</p>
                        <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <p className="font-bold text-white">{formatValue(coin.current_price, false, true)}</p>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <p className={`font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.price_change_percentage_24h >= 0 ? '↗' : '↘'} {formatValue(coin.price_change_percentage_24h, true)}
                    </p>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <p className="text-white">{formatValue(coin.market_cap, false, true)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

window.MarketOverview = MarketOverview;