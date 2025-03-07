import axios from 'axios';
import PropTypes from 'prop-types';
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
import { Typography } from '@mui/material';

export default function UserNewEditForm({ onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const NewUserSchema = Yup.object().shape({
    pocName: Yup.string().required('Name is required'),
    pocEmail1: Yup.string().required('Email is required').email('Email must be a valid email address'),
    pocContact1: Yup.string().required('Phone number is required'),
    pocContact2: Yup.string().required('Phone number 2 is required'),
    cityName: Yup.string().required('City Name is required'), // Updated to match backend schema
    password: Yup.string().required('Password is required'),
    storeCode: Yup.string().required('Store Code is required'),
    storeName: Yup.string().required('Store Name is required'),
    storeUrl: Yup.string().required('Store URL is required'),
    active: Yup.boolean().required('Active status is required'),
  });

  const defaultValues = {
    pocName: '',
    pocEmail1: '',
    pocContact1: '',
    pocContact2: '',
    cityName: '', // Update to match schema
    password: '',
    storeCode: '',
    storeName: '',
    storeUrl: '',
    active: true,
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Sending Data:', data); // Debugging payload
      const uniqueStoreCode = `${data.storeCode}-${Date.now()}`; // Ensure unique storeCode
      const payload = {
        ...data,
        storeCode: uniqueStoreCode, // Assign unique value
      };

      // API Call
      const response = await axios.post(
        'http://localhost:5000/api/postex/createMerchantStore',
        payload
      );

      enqueueSnackbar('Merchant created successfully!');
      reset();
      if (onClose) onClose();
      navigate(paths.dashboard.merchantStore.root);
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      enqueueSnackbar(
        error.response?.data?.message || 'Error occurred while creating merchant!',
        { variant: 'error' }
      );
    }
  });

  return (
    <><Box sx={{ mb: 3 }}>
      <Typography variant="h5" sx={{ textAlign: 'left' }}>
        Add New Merchant 
      </Typography>
    </Box><FormProvider methods={methods} onSubmit={onSubmit}>
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
                <RHFTextField name="pocName" label="Full Name" />
                <RHFTextField name="pocEmail1" label="Email Address" />
                <RHFTextField name="pocContact1" label="Phone Number" />
                <RHFTextField name="pocContact2" label="Phone Number" />
                <RHFTextField name="cityName" label="City Name" /> {/* Updated field */}
                <RHFTextField name="password" label="Password" />
                <RHFTextField name="storeCode" label="Store Code" />
                <RHFTextField name="storeName" label="Store Name" />
                <RHFTextField name="storeUrl" label="Store URL" />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Create Merchant
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider></>
  );
}

UserNewEditForm.propTypes = {
  onClose: PropTypes.func, // Add onClose prop for modal close handling
};
