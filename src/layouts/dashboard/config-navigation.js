import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

// Function to return an icon component for SVG files or Iconify
const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // More icon sources can be found at:
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

// Icons object storing various icons for navigation items
const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales(); // Fetching translations
  const role = localStorage.getItem('role'); // Retrieving user role from localStorage
  console.log("role=========>", role)

  const data = useMemo(
    () => [
      // OVERVIEW
      // Navigation items for the dashboard overview section
      {
        subheader: t('overview'),
        items: [
          {
            title: t('Dashboard'),
            path: paths.dashboard.root, // Path to Dashboard
            icon: ICONS.dashboard, // Icon for Dashboard
          },
          {
            title: t('Merchants'),
            path: paths.dashboard.merchantStore.root, // Path to Merchant Store
            icon: ICONS.user, // Icon for Merchants
            // Add condition to hide Merchants if role is merchant
            visible: role !== 'merchant',
          },
          {
            title: t('Inventory'),
            path: paths.dashboard.product.root, // Path to Inventory
            icon: ICONS.product, // Icon for Inventory
          },
          {
            title: t('Orders'),
            path: paths.dashboard.order.root, // Path to Orders
            icon: ICONS.order, // Icon for Orders
          },
          {
            title: t('callback'),
            path: paths.dashboard.shopify.callback, // Path to Orders
            icon: ICONS.order, // Icon for Orders
          },
        ],
      },

      // MANAGEMENT
      // Management related navigation items
      {
        items: [
          // Add more sections here for user, product, order, etc. with conditional visibility based on user roles.
        ],
      },

      // Example of demo or other menu states (could be used for testing or various cases)
      // {
      //   subheader: t(t('other_cases')),
      //   items: [
      //     {
      //       title: t('item_by_roles'),
      //       path: paths.dashboard.permission,
      //       icon: ICONS.lock,
      //       roles: ['admin', 'manager'], // Accessible only by admin and manager
      //       caption: t('only_admin_can_see_this_item'),
      //     },
      //   ],
      // },
    ],
    [role, t] // Recompute the navigation data when translations change
  );

  return data; // Returning the navigation data for use in the component
}
