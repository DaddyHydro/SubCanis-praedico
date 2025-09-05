import React, { createContext, useContext, useEffect, useState } from 'react';

const PrivyContext = createContext();

export const usePrivy = () => {
  const context = useContext(PrivyContext);
  if (!context) {
    throw new Error('usePrivy must be used within a PrivyProvider');
  }
  return context;
};

export function PrivyProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Privy
    const initPrivy = async () => {
      try {
        // Check if user was previously authenticated
        const savedUser = localStorage.getItem('privy_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setAuthenticated(true);
        }
        
        setReady(true);
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize Privy:', error);
        setLoading(false);
      }
    };

    initPrivy();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      
      // Simulate Privy authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: `privy_${Date.now()}`,
        wallet: {
          address: '0x742d35Cc6634C0532925a3b8D09A80C1f34Dd4f1',
          chainId: 8453
        },
        email: {
          address: 'user@example.com'
        },
        createdAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      setAuthenticated(true);
      localStorage.setItem('privy_user', JSON.stringify(mockUser));
      
      return mockUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setAuthenticated(false);
      localStorage.removeItem('privy_user');
      localStorage.removeItem('user_profile');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    ready,
    authenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <PrivyContext.Provider value={value}>
      {children}
    </PrivyContext.Provider>
  );
}

window.PrivyProvider = PrivyProvider;
window.usePrivy = usePrivy;
window.PrivyProvider = PrivyProvider;
window.usePrivy = usePrivy;