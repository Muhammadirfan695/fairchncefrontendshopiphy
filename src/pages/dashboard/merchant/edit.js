import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { MerchantEditView } from 'src/sections/merchant/view';

// ----------------------------------------------------------------------

export default function MerchantEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Merchant Edit</title>
      </Helmet>

      <MerchantEditView id={`${id}`} />
    </>
  );
}
