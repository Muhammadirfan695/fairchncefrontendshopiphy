import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Tabs, Tab, Box, Stack, Alert, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import LoadingButton from '@mui/lab/LoadingButton';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import useLogin from 'src/api/auth';

const LoginView = () => {
  const { login, authError } = useLogin(); // Use the custom hook
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Must be a valid email'),
    password: Yup.string().required('Password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const loginURL =
      currentTab === 0 || currentTab === undefined
        ? 'https://api.axoraexpress.com/api/auth/admin/login'
        : 'https://api.axoraexpress.com/api/auth/merchant/login';

    try {
      const response = await login(loginURL, data.email, data.password);
      if (response.success) {
        const { role, token } = response;
        // Store the token and role in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', role); // Save the role here

        if (role === 'admin') {
          router.push('/dashboard'); // Admin dashboard
        } else if (role === 'merchant') {
          localStorage.setItem('shopifyToken', response.shopifyToken); // Shopify token
          router.push('/dashboard'); // Merchant dashboard
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const shop = urlParams.get('shop');

    if (token && shop) {
      localStorage.setItem('shopify_token', token);
      localStorage.setItem('shop', shop);
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <>
      <Box sx={{ my: 5 }}>
        <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
          Welcome To Axora
        </Typography>
      </Box>
      <Box
        sx={{
          mb: 3,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} centered>
          <Tab label="Admin Login" />
          <Tab label="Merchant Login" />
        </Tabs>
      </Box>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {authError && <Alert severity="error">{authError}</Alert>}

          <RHFTextField name="email" label="Email" />
          <RHFTextField name="password" label="Password" type="password" />

          <LoadingButton fullWidth variant="contained" type="submit" loading={isSubmitting}>
            {currentTab === 0 ? 'Login as Admin' : 'Login as Merchant'}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
};

export default LoginView;
