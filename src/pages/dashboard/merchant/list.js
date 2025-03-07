import { Helmet } from 'react-helmet-async';
// sections
import { MerchantListView } from 'src/sections/merchant/view';

// ----------------------------------------------------------------------

export default function MerchantListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Merchant List</title>
      </Helmet>

      <MerchantListView />
    </>
  );
}
