import axios from 'axios';

export const fetchShopifyOrders = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_HOST_API}/api/shopify/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Shopify orders:', error.message);
    throw error;
  }
};

export const addOrders = async (orderData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/api/postex/createOrders`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.message);
    throw error;
  }
};

// export const fetchShopifyProducts = async () => {
//   try {
//     const response = await axios.get(`${process.env.REACT_APP_HOST_API}/api/shopify/products`);
//     console.log('Shopify Products Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching Shopify products:', error.message);
//     throw error;
//   }
// };