import React, { useState, useEffect } from 'react';

function PriceWidget({ coinId = 'bitcoin', coinName = 'Bitcoin', coinSymbol = 'BTC', size = 'medium' }) {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrice = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`
      );
      const data = await response.json();
      
      if (data[coinId]) {
        setPriceData(data[coinId]);
        setError(null);
      } else {
        setError('Coin not found');
      }
    } catch (err) {
      setError('Failed to fetch price data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [coinId]);

  const formatPrice = (price) => {
    if (price >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 8,
      }).format(price);
    }
  };

  const formatChange = (change) => {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change?.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? '↗' : '↘';
  };

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const textSizes = {
    small: {
      title: 'text-lg',
      price: 'text-2xl',
      change: 'text-sm'
    },
    medium: {
      title: 'text-xl',
      price: 'text-3xl',
      change: 'text-base'
    },
    large: {
      title: 'text-2xl',
      price: 'text-4xl',
      change: 'text-lg'
    }
  };

  if (loading) {
    return (
      <div className={`glass-morphism rounded-xl ${sizeClasses[size]} crypto-card animate-pulse`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full animate-pulse"></div>
            <div>
              <div className="w-20 h-4 bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="w-12 h-3 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="loading-spinner"></div>
        </div>
        <div className="mt-4">
          <div className="w-32 h-8 bg-gray-600 rounded animate-pulse mb-2"></div>
          <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-morphism rounded-xl ${sizeClasses[size]} crypto-card border-red-500/30`}>
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️</div>
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={fetchPrice}
            className="mt-2 px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-morphism rounded-xl ${sizeClasses[size]} crypto-card animate-slide-in`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{coinSymbol.charAt(0)}</span>
          </div>
          <div>
            <h3 className={`font-bold text-white ${textSizes[size].title}`}>{coinName}</h3>
            <p className="text-gray-400 text-sm uppercase">{coinSymbol}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className={`font-bold text-white ${textSizes[size].price}`}>
          {formatPrice(priceData?.usd)}
        </div>
        
        <div className={`flex items-center space-x-2 ${textSizes[size].change}`}>
          <span className={`${getChangeColor(priceData?.usd_24h_change)} font-medium`}>
            {getChangeIcon(priceData?.usd_24h_change)} {formatChange(priceData?.usd_24h_change)}
          </span>
          <span className="text-gray-400 text-xs">24h</span>
        </div>
        
        {priceData?.last_updated_at && (
          <div className="text-xs text-gray-500 mt-2">
            Updated: {new Date(priceData.last_updated_at * 1000).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}

window.PriceWidget = PriceWidget;