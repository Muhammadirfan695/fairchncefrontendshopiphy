import { Helmet } from 'react-helmet-async';
// sections
import { MerchantProfileView } from 'src/sections/merchant/view';

// ----------------------------------------------------------------------

export default function MerchantProfilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Merchant Profile</title>
      </Helmet>

      <MerchantProfileView />
    </>
  );
}
