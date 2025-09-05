import React, { useState, useEffect } from 'react';

function CryptoCalculator() {
  const [amount, setAmount] = useState('1');
  const [fromCoin, setFromCoin] = useState('bitcoin');
  const [toCoin, setToCoin] = useState('usd');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popularCoins, setPopularCoins] = useState([]);

  const popularCryptos = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  ];

  const fiatCurrencies = [
    { id: 'usd', name: 'US Dollar', symbol: 'USD' },
    { id: 'eur', name: 'Euro', symbol: 'EUR' },
    { id: 'gbp', name: 'British Pound', symbol: 'GBP' },
    { id: 'jpy', name: 'Japanese Yen', symbol: 'JPY' },
    { id: 'cad', name: 'Canadian Dollar', symbol: 'CAD' },
    { id: 'aud', name: 'Australian Dollar', symbol: 'AUD' },
  ];

  const fetchConversion = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    try {
      const isCrypto = popularCryptos.some(coin => coin.id === fromCoin);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${fromCoin}&vs_currencies=${toCoin}&include_24hr_change=true`
      );
      const data = await response.json();
      
      if (data[fromCoin] && data[fromCoin][toCoin]) {
        const rate = data[fromCoin][toCoin];
        const convertedAmount = parseFloat(amount) * rate;
        const change24h = data[fromCoin][`${toCoin}_24h_change`];
        
        setResult({
          amount: convertedAmount,
          rate: rate,
          change24h: change24h
        });
      }
    } catch (err) {
      console.error('Conversion failed:', err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversion();
  }, [amount, fromCoin, toCoin]);

  const formatResult = (value) => {
    if (value >= 1) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } else {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      }).format(value);
    }
  };

  const formatRate = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(value);
  };

  const swapCurrencies = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
  };

  return (
    <div className="glass-morphism rounded-xl p-6 crypto-card animate-slide-in">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] mb-6">
        🔄 Crypto Calculator
      </h2>

      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00d2ff] transition-colors"
            placeholder="Enter amount"
            min="0"
            step="any"
          />
        </div>

        {/* From Currency */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">From</label>
          <select
            value={fromCoin}
            onChange={(e) => setFromCoin(e.target.value)}
            className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d2ff] transition-colors"
          >
            <optgroup label="Cryptocurrencies">
              {popularCryptos.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </option>
              ))}
            </optgroup>
            <optgroup label="Fiat Currencies">
              {fiatCurrencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-3 bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] rounded-full hover:from-[#3a7bd5] hover:to-[#00d2ff] transition-all duration-300 transform hover:scale-110"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">To</label>
          <select
            value={toCoin}
            onChange={(e) => setToCoin(e.target.value)}
            className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d2ff] transition-colors"
          >
            <optgroup label="Fiat Currencies">
              {fiatCurrencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </optgroup>
            <optgroup label="Cryptocurrencies">
              {popularCryptos.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Result */}
        <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="loading-spinner"></div>
              <span className="ml-2 text-gray-400">Converting...</span>
            </div>
          ) : result ? (
            <div>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-white">
                  {formatResult(result.amount)}
                </p>
                <p className="text-gray-400 text-sm">
                  {amount} {popularCryptos.find(c => c.id === fromCoin)?.symbol || fiatCurrencies.find(c => c.id === fromCoin)?.symbol} = 
                  {' '}{formatResult(result.amount)} {popularCryptos.find(c => c.id === toCoin)?.symbol || fiatCurrencies.find(c => c.id === toCoin)?.symbol}
                </p>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Exchange Rate</span>
                  <span className="text-white">1 = {formatRate(result.rate)}</span>
                </div>
                
                {result.change24h && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-sm">24h Change</span>
                    <span className={`${result.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {result.change24h >= 0 ? '↗' : '↘'} {result.change24h.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400">Enter an amount to see conversion</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.CryptoCalculator = CryptoCalculator;