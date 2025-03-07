import { Helmet } from 'react-helmet-async';
// sections
import { MerchantCreateView } from 'src/sections/merchant/view';

// ----------------------------------------------------------------------

export default function MerchantCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Merchant</title>
      </Helmet>

      <MerchantCreateView />
    </>
  );
}
