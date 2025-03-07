import axios from 'axios';

export const fetchMerchantsList = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_HOST_API}api/postex/merchantStoreList`);
    return response;
  } catch (error) {
    console.error('Error fetching merchants list:', error.message);
    throw error;
  }
};

export const addMerchantsStore = async (merchantData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}api/postex/createMerchantStore`,
      merchantData
    );
    return response;
  } catch (error) {
    console.error('Error creating merchant store:', error.message);
    throw error;
  }
};

export const updateMerchantsStore = async () => {
  try {
    const response = await axios.patch(`${process.env.REACT_APP_HOST_API}api/postex/updateMerchantStore`);
    return response;
  } catch (error) {
    console.error('Error updating merchant store:', error.message);
    throw error;
  }
};
