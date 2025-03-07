import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import MainLayout from 'src/layouts/main';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { ShopifyCallbackView } from 'src/sections/shopifyCallback/view';
// Routes
import { mainRoutes, HomePage } from './main';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

export default function Router() {
  return useRoutes([
    // Shopify callback route (Before login)
    {
      path: '/shopify/callback', 
      element: <ShopifyCallbackView />,
    },

    // Redirect to the main route after login
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    // Auth routes (Login-related routes)
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard routes (Accessible after login)
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,

    // Components routes
    ...componentsRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
