import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { AuthContext } from '../context/jwt';

const loginPaths = {
  admin: paths.auth.jwt.login,
  merchant: paths.auth.jwt.login,
};

export default function AuthGuard({ children }) {
  const router = useRouter();
  // const { authData, setAuthData } = useContext(AuthContext);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');

    if (!token || !role) {
      const searchParams = new URLSearchParams({
        returnTo: paths.dashboard.root,
      }).toString();

      const loginPath = loginPaths[role || 'admin'];
      router.replace(`${loginPath}?${searchParams}`);
    } else {
      setAuthData({ token, role });
      setLoading(false);
    }
  }, [router, setAuthData]);

  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
