// use-auth-context.js
import { useContext } from 'react';
import { AuthContext } from '../context/jwt/auth-context'; // Import the AuthContext

// Hook to access the authentication context
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    // Throw an error if this hook is used outside of AuthProvider
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context; // Return context value (authData, authError, login, logout, etc.)
};
