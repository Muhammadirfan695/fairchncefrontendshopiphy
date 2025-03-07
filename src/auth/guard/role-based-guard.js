import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router';

import { m } from 'framer-motion';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ForbiddenIllustration } from 'src/assets/illustrations';
import { MotionContainer, varBounce } from 'src/components/animate';
import { AuthContext } from '../context/jwt/auth-context'; // Fixed import path

// Role-based-guard.js

export default function RoleBasedGuard({ hasContent, roles, children, sx }) {
  const { user } = useContext(AuthContext); // Use the AuthContext here to get user data
  const currentRole = user?.role;

  // Check if the user's role is allowed
  console.log("Current Role:", currentRole);
  if (roles && !roles.includes(currentRole)) {
    console.log("Unauthorized Access for Role:", currentRole);
    return hasContent ? (
      <Container>
        <Typography>Permission Denied</Typography>
      </Container>
    ) : (
      <Navigate to="/unauthorized" />
    );
  }
  
  

  return <>{children}</>;
}

RoleBasedGuard.propTypes = {
  children: PropTypes.node,
  hasContent: PropTypes.bool,
  roles: PropTypes.arrayOf(PropTypes.string),
  sx: PropTypes.object,
};
