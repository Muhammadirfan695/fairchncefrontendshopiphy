import React from 'react';

import { Button } from '@mui/material';

const InstallAppButton = () => {
  const handleInstall = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/shopify/install?shop=your-store.myshopify.com`;
  };

  return (
    <Button onClick={handleInstall}>Install Shopify App</Button>
  );
};

export default InstallAppButton;
