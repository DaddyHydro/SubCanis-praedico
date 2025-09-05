import React, { useState, useEffect } from 'react';

function PriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    coinSymbol: 'BTC',
    targetPrice: '',
    condition: 'above', // 'above' or 'below'
  });
  const [currentPrices, setCurrentPrices] = useState({});
  
  const popularCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  ];

  // Load alerts from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem('cryptoAlerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('cryptoAlerts', JSON.stringify(alerts));
  }, [alerts]);

  // Fetch current prices for alerts
  useEffect(() => {
    const fetchPrices = async () => {
      if (alerts.length === 0) return;
      
      const coinIds = [...new Set(alerts.map(alert => alert.coinId))];
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`
        );
        const data = await response.json();
        setCurrentPrices(data);
        
        // Check for triggered alerts
        checkAlerts(data);
      } catch (err) {
        console.error('Failed to fetch prices:', err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [alerts]);

  const checkAlerts = (prices) => {
    alerts.forEach(alert => {
      const currentPrice = prices[alert.coinId]?.usd;
      if (!currentPrice) return;

      const isTriggered = 
        (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && currentPrice <= alert.targetPrice);

      if (isTriggered && !alert.triggered) {
        // Mark alert as triggered
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, triggered: true, triggeredAt: Date.now() } : a
        ));

        // Show notification (if supported)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Crypto Price Alert', {
            body: `${alert.coinName} is now ${alert.condition} $${alert.targetPrice}! Current price: $${currentPrice.toFixed(2)}`,
            icon: '/favicon.ico'
          });
        }
      }
    });
  };

  const addAlert = () => {
    if (!newAlert.targetPrice || isNaN(newAlert.targetPrice) || newAlert.targetPrice <= 0) {
      alert('Please enter a valid target price');
      return;
    }

    const alert = {
      id: Date.now(),
      ...newAlert,
      targetPrice: parseFloat(newAlert.targetPrice),
      createdAt: Date.now(),
      triggered: false,
    };

    setAlerts(prev => [...prev, alert]);
    setNewAlert({ ...newAlert, targetPrice: '' });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const handleCoinChange = (coinId) => {
    const coin = popularCoins.find(c => c.id === coinId);
    setNewAlert({
      ...newAlert,
      coinId,
      coinName: coin.name,
      coinSymbol: coin.symbol,
    });
  };

  return (
    <div className="glass-morphism rounded-xl p-6 crypto-card animate-slide-in">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] mb-6">
        🔔 Price Alerts
      </h2>

      {/* Add New Alert */}
      <div className="bg-black/20 rounded-lg p-4 mb-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Create New Alert</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Cryptocurrency</label>
            <select
              value={newAlert.coinId}
              onChange={(e) => handleCoinChange(e.target.value)}
              className="w-full bg-black/20 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d2ff] transition-colors"
            >
              {popularCoins.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Condition</label>
            <select
              value={newAlert.condition}
              onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
              className="w-full bg-black/20 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d2ff] transition-colors"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Target Price ($)</label>
            <input
              type="number"
              value={newAlert.targetPrice}
              onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
              className="w-full bg-black/20 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#00d2ff] transition-colors"
              placeholder="Enter price"
              min="0"
              step="any"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={addAlert}
              className="w-full px-4 py-2 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] rounded-lg text-white font-medium hover:from-[#3a7bd5] hover:to-[#00d2ff] transition-all duration-300"
            >
              Add Alert
            </button>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Active Alerts ({alerts.filter(a => !a.triggered).length})
        </h3>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔕</div>
            <p className="text-gray-400">No price alerts set</p>
            <p className="text-gray-500 text-sm">Create an alert to get notified when prices hit your targets</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const currentPrice = currentPrices[alert.coinId]?.usd;
              const progress = currentPrice && alert.targetPrice ? 
                Math.min(100, Math.max(0, 
                  alert.condition === 'above' 
                    ? (currentPrice / alert.targetPrice) * 100
                    : ((alert.targetPrice - currentPrice) / alert.targetPrice) * 100 + 50
                )) : 0;

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border transition-all ${
                    alert.triggered 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-black/20 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-white">{alert.coinName}</span>
                        <span className="text-gray-400 text-sm uppercase">{alert.coinSymbol}</span>
                        {alert.triggered && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            Triggered ✓
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        Alert when price goes{' '}
                        <span className={alert.condition === 'above' ? 'text-green-400' : 'text-red-400'}>
                          {alert.condition}
                        </span>{' '}
                        {formatPrice(alert.targetPrice)}
                      </div>
                      
                      {currentPrice && (
                        <div className="text-sm mt-2">
                          <span className="text-gray-400">Current: </span>
                          <span className="text-white font-medium">{formatPrice(currentPrice)}</span>
                          <span className={`ml-2 ${
                            alert.condition === 'above' 
                              ? currentPrice >= alert.targetPrice ? 'text-green-400' : 'text-yellow-400'
                              : currentPrice <= alert.targetPrice ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {alert.condition === 'above' 
                              ? currentPrice >= alert.targetPrice ? '✓ Triggered' : `${((currentPrice / alert.targetPrice) * 100).toFixed(1)}%`
                              : currentPrice <= alert.targetPrice ? '✓ Triggered' : `${(((alert.targetPrice - currentPrice) / alert.targetPrice) * 100).toFixed(1)}% to go`
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification Status */}
      <div className="mt-6 p-3 bg-black/20 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Browser Notifications</span>
          <span className={`text-sm ${
            Notification?.permission === 'granted' 
              ? 'text-green-400' 
              : Notification?.permission === 'denied'
              ? 'text-red-400'
              : 'text-yellow-400'
          }`}>
            {Notification?.permission === 'granted' 
              ? '✓ Enabled' 
              : Notification?.permission === 'denied'
              ? '✗ Blocked'
              : '⚠ Not Set'
            }
          </span>
        </div>
        {Notification?.permission !== 'granted' && (
          <p className="text-gray-500 text-xs mt-1">
            Enable notifications to receive alerts when price targets are hit
          </p>
        )}
      </div>
    </div>
  );
}

window.PriceAlerts = PriceAlerts;