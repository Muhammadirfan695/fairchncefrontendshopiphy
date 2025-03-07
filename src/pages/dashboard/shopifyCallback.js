import { Helmet } from 'react-helmet-async';
// sections
import { ShopifyCallbackView } from 'src/sections/shopifyCallback/view';

// ----------------------------------------------------------------------

export default function ShopifyCallbackPage() {
  return (
    <>
      <Helmet>
        <title> ShopifyCallbackView</title>
      </Helmet>

      <ShopifyCallbackView />
    </>
  );
}
