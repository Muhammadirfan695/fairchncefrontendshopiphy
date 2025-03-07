import { Helmet } from 'react-helmet-async';
// sections
import { MerchantCardsView } from 'src/sections/merchant/view';

// ----------------------------------------------------------------------

export default function MerchantCardsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Merchant Cards</title>
      </Helmet>

      <MerchantCardsView />
    </>
  );
}
