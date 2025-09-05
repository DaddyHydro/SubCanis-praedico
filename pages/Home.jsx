import React, { useState } from 'react';

function Home() {
  const [activeTab, setActiveTab] = useState('markets');

  const tabs = [
    { id: 'markets', label: 'Prediction Markets', icon: '🎯', dogEmoji: '🐕‍🦺' },
    { id: 'portfolio', label: 'My Portfolio', icon: '📊', dogEmoji: '🐕‍💼' },
    { id: 'data', label: 'Market Data', icon: '📈', dogEmoji: '🐕‍💻' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'markets':
        return <window.PredictionMarket />;
      case 'portfolio':
        return <window.ActiveMarkets />;
      case 'data':
        return <window.MarketData />;
      default:
        return <window.PredictionMarket />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="relative">
              <img 
                src="assets/subcanis-mascot.webp" 
                alt="SubCanis Mascot" 
                className="w-20 h-20 rounded-full border-4 border-pink-400 animate-pulse-glow"
              />
              <div className="absolute -top-1 -right-1 animate-bounce">
                <span className="text-2xl">💖</span>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-black mb-2 drop-shadow-2xl">
                SubCanis Praedico
              </h1>
              <div className="flex justify-center space-x-2 mb-2">
                <span className="animate-bounce delay-0">🐕</span>
                <span className="animate-bounce delay-100">🎮</span>
                <span className="animate-bounce delay-200">💰</span>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-300 mb-3 flex items-center justify-center">
            <span className="mr-2">🎯</span>
            Crypto Prediction Markets • Powered by $UDOG
            <span className="ml-2">🚀</span>
          </p>
          <p className="text-gray-400 flex items-center justify-center">
            <span className="mr-2">🐾</span>
            Make predictions on cryptocurrency events and earn rewards
            <span className="ml-2">⭐</span>
          </p>
        </div>

        {/* Top Section - Wallet & Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <window.WalletConnect />
          <window.TokenBalance />
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-10 space-x-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 border-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg border-white/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-gray-600/30'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="animate-bounce">{tab.dogEmoji}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="mb-10">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-700/50">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <img 
              src="assets/dog-avatar-gaming.webp" 
              alt="Footer Dog" 
              className="w-8 h-8 rounded-full border-2 border-pink-400"
            />
            <p className="text-gray-400 text-sm">
              SubCanis Praedico • Built on Base • Powered by $UDOG
            </p>
            <div className="flex space-x-1">
              <span className="animate-bounce delay-0">🎮</span>
              <span className="animate-bounce delay-100">💖</span>
              <span className="animate-bounce delay-200">🚀</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs flex items-center justify-center">
            <span className="mr-2">⚠️</span>
            This platform is for entertainment purposes. Please predict responsibly and do your own research.
            <span className="ml-2">🐕</span>
          </p>
        </div>
      </div>
    </div>
  );
}

window.Home = Home;