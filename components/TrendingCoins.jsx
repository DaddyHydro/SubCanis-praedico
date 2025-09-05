import React, { useState, useEffect } from 'react';

function TrendingCoins() {
  const [trendingData, setTrendingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
      const data = await response.json();
      setTrendingData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch trending data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
    const interval = setInterval(fetchTrending, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 4,
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(marketCap);
  };

  if (loading) {
    return (
      <div className="glass-morphism rounded-xl p-6 crypto-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]">
            🔥 Trending Coins
          </h2>
          <div className="loading-spinner"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
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
    );
  }

  if (error) {
    return (
      <div className="glass-morphism rounded-xl p-6 crypto-card border-red-500/30">
        <h2 className="text-2xl font-bold text-red-400 mb-4">🔥 Trending Coins</h2>
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchTrending}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-xl p-6 crypto-card animate-slide-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]">
          🔥 Trending Coins
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Trending</span>
        </div>
      </div>

      <div className="space-y-4">
        {trendingData?.coins?.slice(0, 7).map((coin, index) => (
          <div key={coin.item.id} className="flex items-center space-x-4 hover:bg-white/5 p-3 rounded-lg transition-colors">
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-gray-400 font-mono text-sm w-6">#{index + 1}</span>
              <img
                src={coin.item.thumb}
                alt={coin.item.name}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <p className="font-semibold text-white">{coin.item.name}</p>
                <p className="text-gray-400 text-sm uppercase">{coin.item.symbol}</p>
              </div>
            </div>
            
            <div className="text-right">
              {coin.item.data?.price && (
                <p className="font-bold text-white">{formatPrice(coin.item.data.price)}</p>
              )}
              {coin.item.data?.market_cap && (
                <p className="text-gray-400 text-sm">
                  MC: {formatMarketCap(coin.item.data.market_cap.replace(/[^0-9.-]/g, ''))}
                </p>
              )}
              {coin.item.market_cap_rank && (
                <p className="text-gray-500 text-xs">
                  Rank #{coin.item.market_cap_rank}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Top trending cryptocurrencies on CoinGecko
        </p>
      </div>
    </div>
  );
}

window.TrendingCoins = TrendingCoins;