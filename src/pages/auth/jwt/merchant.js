import { Helmet } from 'react-helmet-async';
import { MerchantLoginView } from 'src/sections/auth/jwt';
// sections
// ----------------------------------------------------------------------

export default function MerchantLoginPage() {
  return (
    <>
      <Helmet>
        <title> Login: Merchant Login</title>
      </Helmet>

      <MerchantLoginView />
    </>
  );
}
