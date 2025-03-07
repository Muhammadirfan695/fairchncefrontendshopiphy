import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { ShopifyCallbackView } from 'src/sections/shopifyCallback/view';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderCreatePage = lazy(() => import('src/pages/dashboard/order/create'));
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// Merchant
const MerchantListPage = lazy(() => import('src/pages/dashboard/merchant/list'));
const MerchantCreatePage = lazy(() => import('src/pages/dashboard/merchant/new'));
const MerchantProfilePage = lazy(() => import('src/pages/dashboard/merchant/profile'));
const MerchantCardsPage = lazy(() => import('src/pages/dashboard/merchant/cards'));
const MerchantAccountPage = lazy(() => import('src/pages/dashboard/merchant/account'));
const MerchantEditPage = lazy(() => import('src/pages/dashboard/merchant/edit'));

// ----------------------------------------------------------------------
export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      // <AuthGuard>
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
      // </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'analytics',
        element: (
          <RoleBasedGuard allowedRoles={['admin']}>
            <IndexPage />
          </RoleBasedGuard>
        ),
      },

      {
        path: 'merchant',
        element: (
          <RoleBasedGuard allowedRoles={['admin', 'merchant']}>
            {' '}
            {/* Role guard for merchants */}
            <MerchantListPage />
          </RoleBasedGuard>
        ),
        children: [
          { element: <MerchantListPage />, index: true },
          { path: 'new', element: <MerchantCreatePage /> },
          { path: 'profile', element: <MerchantProfilePage /> },
          { path: 'cards', element: <MerchantCardsPage /> },
          { path: 'account', element: <MerchantAccountPage /> },
          { path: ':id/edit', element: <MerchantEditPage /> },
        ],
      },

      // Product Route Guarded by RoleBasedGuard (if needed)
      {
        path: 'product',
        element: (
          <RoleBasedGuard allowedRoles={['admin', 'merchant']}>
            <ProductListPage />
          </RoleBasedGuard>
        ),
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },

      // Order Route Guarded by RoleBasedGuard
      {
        path: 'order',
        element: (
          <RoleBasedGuard allowedRoles={['admin', 'merchant']}>
            <OrderListPage />
          </RoleBasedGuard>
        ),
        children: [
          { element: <OrderListPage />, index: true },
          // { path: 'list', element: <OrderListPage /> },
          { path: 'create', element: <OrderCreatePage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      // {
      //   path: 'shopify',
      //   element: (
      //     <RoleBasedGuard allowedRoles={['admin', 'merchant']}>
      //       <ShopifyCallbackView />
      //     </RoleBasedGuard>
      //   ),
      //   children: [
      //     // { element: <ShopifyCallbackView />, index: true },
      //     // { path: 'list', element: <OrderListPage /> },
      //   ],
      // },
    ],
  },
];
