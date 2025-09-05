import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const supabaseUrl = 'https://yufcumgdigfxiujiunzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1ZmN1bWdkaWdmeGl1aml1bnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTkwNTEsImV4cCI6MjA3MjY3NTA1MX0.Pn_9RldFrJnL7YlU-0UcoMzXCf34X0kXRTigmUJIuaE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const API_BASE_URL = 'https://yufcumgdigfxiujiunzz.supabase.co/functions/v1';

// API helper function
async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API call failed');
  }
  
  return data;
}

// Users API
export const usersApi = {
  getAll: () => apiCall('users-api'),
  getById: (userId) => apiCall(`users-api/${userId}`),
  create: (userData) => apiCall('users-api', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  update: (userId, userData) => apiCall(`users-api/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  })
};

// Markets API
export const marketsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`markets-api${query ? `?${query}` : ''}`);
  },
  getById: (marketId) => apiCall(`markets-api/${marketId}`),
  create: (marketData) => apiCall('markets-api', {
    method: 'POST',
    body: JSON.stringify(marketData)
  })
};

// Positions API
export const positionsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`positions-api${query ? `?${query}` : ''}`);
  },
  create: (positionData) => apiCall('positions-api', {
    method: 'POST',
    body: JSON.stringify(positionData)
  })
};

// Balances API
export const balancesApi = {
  getByUserId: (userId) => apiCall(`balances-api/${userId}`),
  create: (balanceData) => apiCall('balances-api', {
    method: 'POST',
    body: JSON.stringify(balanceData)
  }),
  update: (updateData) => apiCall('balances-api', {
    method: 'PUT',
    body: JSON.stringify(updateData)
  })
};

// Transactions API
export const transactionsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`transactions-api${query ? `?${query}` : ''}`);
  },
  create: (transactionData) => apiCall('transactions-api', {
    method: 'POST',
    body: JSON.stringify(transactionData)
  }),
  update: (transactionId, updateData) => apiCall(`transactions-api/${transactionId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  })
};

// Comments API
export const commentsApi = {
  getByMarketId: (marketId) => apiCall(`comments-api?market_id=${marketId}`),
  create: (commentData) => apiCall('comments-api', {
    method: 'POST',
    body: JSON.stringify(commentData)
  }),
  update: (commentId, updateData) => apiCall(`comments-api/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  }),
  delete: (commentId) => apiCall(`comments-api/${commentId}`, {
    method: 'DELETE'
  })
};

window.supabaseLib = {
  supabase,
  usersApi,
  marketsApi,
  positionsApi,
  balancesApi,
  transactionsApi,
  commentsApi
};
window.supabase = supabase;