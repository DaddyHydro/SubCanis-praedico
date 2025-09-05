import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { usersApi } = window.supabaseLib;
  const { user: privyUser, authenticated } = window.usePrivy();

  const createOrUpdateUser = async (privyUserData) => {
    if (!privyUserData) return null;

    try {
      setLoading(true);
      setError(null);

      // Try to get existing user first
      const existingUsers = await usersApi.getAll();
      const existingUser = existingUsers.data?.find(u => u.privy_id === privyUserData.id);

      if (existingUser) {
        setCurrentUser(existingUser);
        localStorage.setItem('user_profile', JSON.stringify(existingUser));
        return existingUser;
      }

      // Create new user
      const newUserData = {
        privy_id: privyUserData.id,
        wallet_address: privyUserData.wallet?.address || '',
        email: privyUserData.email?.address || '',
        username: `User${privyUserData.id.slice(-6)}`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${privyUserData.id}`
      };

      const createdUser = await usersApi.create(newUserData);
      
      if (createdUser.success) {
        // Get full user data
        const fullUser = await usersApi.getById(createdUser.data.id);
        if (fullUser.success) {
          setCurrentUser(fullUser.data);
          localStorage.setItem('user_profile', JSON.stringify(fullUser.data));
          
          // Initialize user balance
          await initializeUserBalance(fullUser.data.id);
          
          return fullUser.data;
        }
      }
    } catch (err) {
      console.error('Failed to create or update user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initializeUserBalance = async (userId) => {
    try {
      const { balancesApi } = window.supabaseLib;
      await balancesApi.create({
        user_id: userId,
        token_symbol: 'USDC',
        balance: '1000.0'
      });
    } catch (err) {
      console.error('Failed to initialize user balance:', err);
    }
  };

  const updateProfile = async (updates) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      const response = await usersApi.update(currentUser.id, updates);
      
      if (response.success) {
        const updatedUser = { ...currentUser, ...updates };
        setCurrentUser(updatedUser);
        localStorage.setItem('user_profile', JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!currentUser) return;

    try {
      const response = await usersApi.getById(currentUser.id);
      if (response.success) {
        setCurrentUser(response.data);
        localStorage.setItem('user_profile', JSON.stringify(response.data));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  useEffect(() => {
    if (authenticated && privyUser) {
      createOrUpdateUser(privyUser);
    } else if (!authenticated) {
      setCurrentUser(null);
      localStorage.removeItem('user_profile');
    }
  }, [authenticated, privyUser]);

  // Load saved user profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile && authenticated) {
      try {
        setCurrentUser(JSON.parse(savedProfile));
      } catch (err) {
        console.error('Failed to parse saved profile:', err);
        localStorage.removeItem('user_profile');
      }
    }
  }, [authenticated]);

  const value = {
    currentUser,
    loading,
    error,
    updateProfile,
    refreshUser,
    createOrUpdateUser
  };

  return React.createElement(UserContext.Provider, { value }, children);
}

window.UserProvider = UserProvider;
window.useUser = useUser;
window.UserProvider = UserProvider;
window.useUser = useUser;