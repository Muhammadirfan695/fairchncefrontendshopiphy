import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ShopifyCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const shop = searchParams.get('shop');
    if (shop) {
      console.log("Shopify Callback Success:", shop);
      navigate('/dashboard'); // Redirect to dashboard after successful callback
    } else {
      console.error("Shopify Callback Error: No shop found");
      navigate('/login'); // Redirect to login if no shop found
    }
  }, [searchParams, navigate]);

  return <div>Processing Shopify Callback...</div>;
}
