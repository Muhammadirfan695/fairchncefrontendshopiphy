// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

export default function MerchantCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Merchant"
        links={[
          {
            name: 'Merchant',
            href: paths.dashboard.merchant.root,
          },
          { name: 'New Merchant' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm />
    </Container>
  );
}
