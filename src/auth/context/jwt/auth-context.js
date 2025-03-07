import React, { createContext, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('role');
    console.log('role=====>', storedRole);
    return storedToken && storedRole ? { token: storedToken, role: storedRole } : null;
  });
  console.log('auth data=================>', authData);

  const [authError, setAuthError] = useState(null); // Error state for authentication

  // Save auth data (token and role) to localStorage and update state
  const saveAuthData = (token, role) => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');

    console.log('saveAuthData called with', { token, role });

    localStorage.setItem('authToken', token);
    localStorage.setItem('role', role || 'defaultRole');
    setAuthData({ token, role: role || 'defaultRole' });
  };

  // Clear auth data from localStorage and update state
  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('shopifyToken');
    setAuthData(null);

    // Optional: Clear any stored session state (if required)
  };

  const logout = useCallback(() => clearAuth(), []); // Calls clearAuth

  // Login function for both Admin and Merchant
  const login = useCallback(async (url, email, password) => {
    try {
      setAuthError(null); // Reset previous errors

      const payload = url.includes('merchant')
        ? { pocEmail1: email, password } // Merchant-specific payload
        : { email, password }; // Admin-specific payload

      const response = await axios.post(url, payload);

      // Destructure token and role from the response
      const { token, role } = response.data;

      if (token && role) {
        // Save the token and role from the API response
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', role);

        // Update the state
        setAuthData({ token, role });

        return { success: true, role }; // Return success and role
      }

      throw new Error('Login failed. Please try again.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setAuthError(errorMessage);
      clearAuth(); // Clear auth if login fails
      return { success: false, error: errorMessage }; // Return error message
    }
  }, []);

  // Value for the context provider
  const value = useMemo(
    () => ({
      authData,
      setAuthData,
      authError,
      login,
      logout,
    }),
    [authData, authError, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
