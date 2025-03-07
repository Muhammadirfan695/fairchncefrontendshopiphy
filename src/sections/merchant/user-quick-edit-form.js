import axios from 'axios';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { updateMerchantsStore } from 'src/api/merchants';

// ----------------------------------------------------------------------

export default function UserQuickEditForm({ currentUser, open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    merchantStoreCode: Yup.string()
      .required('Merchant Store Code is required')
      .min(1, 'Merchant Store Code must not be empty'),
    pocName: Yup.string().required('POC Name is required'),
    storeName: Yup.string().required('Store Name is required'),
    pocContact1: Yup.string()
      .required('POC Contact 1 is required')
      .min(1)
      .max(11, 'POC Contact 1 must be between 1 and 11 characters'),
    pocContact2: Yup.string()
      .required('POC Contact 2 is required')
      .min(1)
      .max(11, 'POC Contact 2 must be between 1 and 11 characters'),
    pocEmail1: Yup.string().required('POC Email 2 is required').email('Invalid email address'),
    storeUrl: Yup.string().required('Store URL is required').url('Invalid URL'),
  });

  const defaultValues = useMemo(
    () => ({
      merchantStoreCode: currentUser?.storeCode || '', // Update storeCode to merchantStoreCode
      pocName: currentUser?.pocName || '',
      storeName: currentUser?.storeName || '',
      pocContact1: currentUser?.pocContact1 || '',
      pocContact2: currentUser?.pocContact2 || '',
      cityName: currentUser?.cityName || '',
      pocEmail1: currentUser?.pocEmail1 || '',
      storeUrl: currentUser?.storeUrl || '',
    }),
    [currentUser]
  );

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
      // Validate if storeCode is present
      if (!data.storeCode || data.storeCode.trim() === '') {
        enqueueSnackbar('Merchant Store Code is required!', { variant: 'error' });
        return;
      }
  
      // Prepare the data to match Postex API requirements
      const requestData = {
        merchantStoreCode: data.storeCode, // Ensure this is correctly passed
        pocName: data.pocName,
        storeName: data.storeName,
        cityName: data.cityName,
        pocContact1: data.pocContact1,
        pocContact2: data.pocContact2,
        pocEmail2: data.pocEmail1, // Adjust field names accordingly
        storeUrl: data.storeUrl,
      };
  
      console.log('Request Data:', requestData);
  
      // Send data to backend
      const response = await updateMerchantsStore(requestData); // Call the hook function
  
      console.log('API Response:', response);
      reset();
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('Error occurred while updating!', { variant: 'error' });
    }
  });
  

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Update Merchant</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="storeName" label="Store Name" />
            <RHFTextField name="pocName" label="POC Name" />
            <RHFTextField name="merchantStoreCode" label="Merchant Store Code" />
            <RHFTextField name="pocEmail1" label="POC Email 2" />
            <RHFTextField name="pocContact1" label="POC Contact 1" />
            <RHFTextField name="pocContact2" label="POC Contact 2" />
            <RHFTextField name="cityName" label="City Name" />
            <RHFTextField name="storeUrl" label="Store URL" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

UserQuickEditForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
