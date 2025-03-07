// // auth-provider.js

// import React, { createContext, useState, useMemo, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authData, setAuthData] = useState(() => {
//     const storedToken = localStorage.getItem('authToken');
//     const storedRole = localStorage.getItem('authRole');
//     return storedToken && storedRole ? { token: storedToken, role: storedRole } : null;
//   });

//   const [authError, setAuthError] = useState(null); // Error state for authentication

//   // Function to save auth data in localStorage and state
//   const saveAuthData = (token, role) => {
//     localStorage.setItem('authToken', token);
//     localStorage.setItem('authRole', role);
//     setAuthData({ token, role });
//   };

//   // Function to clear authentication data
//   const clearAuth = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('authRole');
//     setAuthData(null);
//   };

//   // Login function using axios to make the POST request
//   const login = useCallback(async (url, email, password) => {
//     try {
//       setAuthError(null); // Reset any previous errors
//       const response = await axios.post(url, { email, password });
//       const { token, role } = response.data;
//       saveAuthData(token, role); // Save the response data
//     } catch (error) {
//       setAuthError(error.response?.data?.message || 'Login failed. Please try again.');
//       clearAuth(); // Clear authentication if login fails
//     }
//   }, []);

//   // Logout function to clear auth data
//   const logout = useCallback(() => clearAuth(), []);

//   // Memoize context value to prevent unnecessary re-renders
//   const value = useMemo(() => ({
//     authData,
//     authError,
//     login,
//     logout,
//   }), [authData, authError, login, logout]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };
