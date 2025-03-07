import axios from 'axios';

export const fetchShopifyAnalytics = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_HOST_API}/api/shopify/analytics`);
    console.log('Shopify Analytics Response===========>:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching Shopify Analytics:', error.message);
    throw error;
  }
};
