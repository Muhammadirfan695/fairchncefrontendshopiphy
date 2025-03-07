import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';
import { addOrders } from 'src/api/orders';
import { Typography } from '@mui/material';

export default function UserNewEditForm() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Define validation schema using Yup
  const NewOrderSchema = Yup.object().shape({
    addressLat: Yup.number().required('Latitude is required'),
    addressLong: Yup.number().required('Longitude is required'),
    apartmentNo: Yup.string().required('Apartment number is required'),
    customerEmail: Yup.string().email('Invalid email format').required('Customer email is required'),
    customerName: Yup.string().required('Customer name is required'),
    customerPhone: Yup.string().required('Customer phone is required'),
    deliveryAddress: Yup.string().required('Delivery address is required'),
    deliveryCharges: Yup.number().required('Delivery charges are required'),
    deliveryCity: Yup.string().required('Delivery city is required'),
    deliveryType: Yup.string().required('Delivery type is required'),
    invoiceAmount: Yup.number().required('Invoice amount is required'),
    merchantBranchCode: Yup.string().required('Merchant branch code is required'),
    merchantStoreCode: Yup.string().required('Merchant store code is required'),
    orderWeight: Yup.number().required('Order weight is required'),
    paymentMode: Yup.string().required('Payment mode is required'),
    products: Yup.array().of(
      Yup.object().shape({
        productAmount: Yup.number().required('Product amount is required'),
        productName: Yup.string().required('Product name is required'),
        productQuantity: Yup.number().required('Product quantity is required'),
        skuNumber: Yup.string().required('SKU number is required'),
      })
    ),
    shipmentType: Yup.string().required('Shipment type is required'),
    storeReferenceNumber: Yup.string().required('Store reference number is required'),
    streetNo: Yup.string().required('Street number is required'),
    transactionNote: Yup.string().required('Transaction note is required'),
  });

  // Default values for the form
  const defaultValues = {
    addressLat: 0,
    addressLong: 0,
    apartmentNo: '',
    customerEmail: '',
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryCharges: 0,
    deliveryCity: '',
    deliveryType: 'Same day',
    invoiceAmount: 0,
    merchantBranchCode: '',
    merchantStoreCode: '',
    orderWeight: 0,
    paymentMode: 'COD',
    products: [
      {
        productAmount: 0,
        productName: '',
        productQuantity: 0,
        skuNumber: '',
      },
    ],
    shipmentType: 'Delivery',
    storeReferenceNumber: '',
    streetNo: '',
    transactionNote: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewOrderSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Call the addOrders function to create a new order on Postex
      const response = await addOrders(data); // Pass form data to addOrders
      enqueueSnackbar('Order created successfully!');
      console.log('API Response:', response);
      navigate(paths.order.list); // Navigate after successful creation
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('Error occurred while creating order!');
    }
  });

  return (
    <>
      <Typography variant="h4">Create a New Order</Typography>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid xs={12} md={12}>
          <Grid xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                {/* Add all the fields here */}
                <RHFTextField name="addressLat" label="Latitude" />
                <RHFTextField name="addressLong" label="Longitude" />
                <RHFTextField name="apartmentNo" label="Apartment No" />
                <RHFTextField name="customerEmail" label="Customer Email" />
                <RHFTextField name="customerName" label="Customer Name" />
                <RHFTextField name="customerPhone" label="Customer Phone" />
                <RHFTextField name="deliveryAddress" label="Delivery Address" />
                <RHFTextField name="deliveryCharges" label="Delivery Charges" />
                <RHFTextField name="deliveryCity" label="Delivery City" />
                <RHFTextField name="deliveryType" label="Delivery Type" />
                <RHFTextField name="invoiceAmount" label="Invoice Amount" />
                <RHFTextField name="merchantBranchCode" label="Merchant Branch Code" />
                <RHFTextField name="merchantStoreCode" label="Merchant Store Code" />
                <RHFTextField name="orderWeight" label="Order Weight" />
                <RHFTextField name="paymentMode" label="Payment Mode" />
                <RHFTextField name="shipmentType" label="Shipment Type" />
                <RHFTextField name="storeReferenceNumber" label="Store Reference Number" />
                <RHFTextField name="streetNo" label="Street No" />
                <RHFTextField name="transactionNote" label="Transaction Note" />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Create Order
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
