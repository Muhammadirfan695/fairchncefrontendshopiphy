import { Helmet } from 'react-helmet-async';
// sections
import { UserNewEditForm } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order create</title>
      </Helmet>

      <UserNewEditForm />
    </>
  );
}
