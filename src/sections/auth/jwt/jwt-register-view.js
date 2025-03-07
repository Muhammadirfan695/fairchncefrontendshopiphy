import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
// ----------------------------------------------------------------------

export default function JwtSignupView() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const passwordVisibility = useBoolean();

  const SignupSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    storeName: Yup.string().required('Store name is required'),
    storeUrl: Yup.string().required('Store URL is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    storeName: '',
    storeUrl: '',
  };

  const methods = useForm({
    resolver: yupResolver(SignupSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Function to handle store creation via API
  const addStore = async (storeData) => {
    try {
      // Static token to be included in the header
      const token = 'N1IwMEwzNzU4Mzg6SUREWUI5MTgzNjA=';

      const response = await axios.post(
        'https://oms-api.postex.sa/services/omsintegration/api/merchantStore/createMerchantStore',
        storeData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adding token to the headers
            'Content-Type': 'application/json', // Ensure it's JSON format
          },
        }
      );

      console.log('response=============>', response);

      if (response.status === 201) {
        const { domainUrl, email, password } = response.data;

        // Construct the login URL with the parameters
        const loginUrl = `${domainUrl}/admin/login?email=${email}&password=${password}`;

        // Redirect the user to the Postex admin login page
        window.location.href = loginUrl;
      }
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      setErrorMsg('Error during store creation. Please try again.');
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Prepare the store data
      const storeData = {
        email: data.email,
        password: data.password,
        storeName: data.storeName,
        storeUrl: data.storeUrl,
        pocName: 'Store Owner', // You can add more dynamic fields as needed
        pocContact1: '1234567890', // Sample contact
        pocEmail1: data.email,
        cityName: 'UAE',
      };

      // Call API to add store
      await addStore(storeData);

      // If needed, store token or do further operations after store creation
    } catch (error) {
      setErrorMsg('Error during sign up. Please try again.');
      reset();
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Create an Account</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">Already have an account?</Typography>

        <Link component={RouterLink} href={paths.auth.login.adminLogin} variant="subtitle2">
          Login
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
        type={passwordVisibility.value ? 'text' : 'password'} // Use the renamed variable
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={passwordVisibility.onToggle} edge="end">
                <Iconify
                  icon={passwordVisibility.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <RHFTextField name="storeName" label="Store Name" />
      <RHFTextField name="storeUrl" label="Store URL" />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Sign Up
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      <Alert severity="info" sx={{ mb: 3 }}>
        Use email: <strong>demo@minimals.cc</strong> / password: <strong>demo1234</strong>
      </Alert>
      {renderForm}
    </FormProvider>
  );
}
