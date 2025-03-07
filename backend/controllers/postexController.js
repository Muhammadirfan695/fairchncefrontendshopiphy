const axios = require('axios');

const MerchantAdd = require('../models/MerchantAdd');

const Shop = require('../models/Shop');

const addMerchantStores = async (req, res) => {
  const {
    pocName,
    pocEmail1,
    pocContact1,
    pocContact2,
    cityName,
    password,
    storeCode,
    storeName,
    storeUrl,
    active,
  } = req.body;

  try {
    // Step 1: Send data to Postex API
    const response = await axios.post(
      'https://oms-api.postex.sa/services/omsintegration/api/merchantStore/createMerchantStore',
      {
        pocName,
        pocEmail1,
        pocContact1,
        pocContact2,
        cityName,
        password,
        storeCode,
        storeName,
        storeUrl,
        active,
      },
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          token: 'N1IwMEwzNzU4Mzg6SUREWUI5MTgzNjA=',
        },
      }
    );

    // Step 2: If successful, store data in MongoDB (without Shop)
    if (response.status === 201) {
      const newMerchant = new MerchantAdd({
        pocName,
        pocEmail1,
        pocContact1,
        pocContact2,
        cityName,
        password, // No hashing
        storeCode,
        storeName,
        storeUrl,
        active,
      });

      const savedMerchant = await newMerchant.save();

      return res.status(201).json({
        message: 'Merchant successfully added to Postex and MongoDB',
        postexResponse: response.data,
        mongoResponse: savedMerchant,
      });
    }

    return res.status(response.status).json({
      message: 'Error while creating merchant store in Postex',
      error: response.data,
    });
  } catch (error) {
    console.error('Error during API request:', error.response ? error.response.data : error.message);
    return res.status(500).json({
      message: 'Error while creating merchant store',
      error: error.response ? error.response.data : error.message,
    });
  }
};



const editMerchantStore = async (req, res) => {
  const {
    merchantStoreCode, // Ensure this is being sent properly
    pocName,
    storeName,
    cityName,
    pocContact1,
    pocContact2,
    pocEmail2,
    storeUrl,
  } = req.body;

  if (!merchantStoreCode) {
    return res.status(400).json({
      message: 'Merchant Store Code is required',
    });
  }

  try {
    const response = await axios.patch(
      'https://oms-api.postex.sa/services/omsintegration/api/merchantStore/updateMerchantStore',
      {
        merchantStoreCode,
        pocName,
        storeName,
        cityName,
        pocContact1,
        pocContact2,
        pocEmail2,
        storeUrl,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          token: 'YOUR_VALID_TOKEN',
        },
      }
    );

    console.log('API Response:', response.data);

    if (response.data.statusCode === 200) {
      const updatedMerchant = await MerchantAdd.findOneAndUpdate(
        { merchantStoreCode },
        { storeCode: merchantStoreCode, pocName, storeName, cityName, pocContact1, pocContact2, pocEmail2, storeUrl },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        message: 'Store updated successfully in Postex and MongoDB',
        data: updatedMerchant,
      });
    }

    return res.status(500).json({
      message: 'Error while updating merchant store in Postex',
      error: response.data.message,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Error while updating merchant store',
      error: error.message,
    });
  }
};


// Fetch merchant stores from Postex API
const getMerchantStores = async (req, res) => {
  try {
    const response = await axios.get(
      'https://oms-api.postex.sa/services/omsintegration/api/merchantStore/merchantStoreList',
      {
        headers: {
          'cache-control': 'no-cache',
          'User-Agent': 'ReactClient',
          Accept: '*/*',
          token: 'N1IwMEwzNzU4Mzg6SUREWUI5MTgzNjA=', // Custom token header
        },
      }
    );

    // console.log('Postex API Response:', response.data); // Debugging the response
    res.status(200).json(response.data); // Send data to frontend
  } catch (error) {
    console.error('Error fetching Postex data:', error.message);
    res.status(500).json({
      statusCode: 500,
      statusMessage: 'Something went wrong',
      statusMessageDetail: error.message,
    });
  }
};


const addOrders = async (req, res) => {
  const {
    addressLat,
    addressLong,
    apartmentNo,
    customerEmail,
    customerName,
    customerPhone,
    deliveryAddress,
    deliveryCharges,
    deliveryCity,
    deliveryType,
    discountAmount,
    discountType,
    externalOderId,
    invoiceAmount,
    merchantBranchCode,
    merchantStoreCode,
    orderWeight,
    paymentMode,
    products,
    shipmentType,
    storeReferenceNumber,
    streetNo,
    transactionNote,
  } = req.body;

  try {
    // Sending API request to the OMS API endpoint with the updated parameters
    const response = await axios.post(
      'https://oms-api.postex.sa/services/omsintegration/api/order/create',
      {
        addressLat,
        addressLong,
        apartmentNo,
        customerEmail,
        customerName,
        customerPhone,
        deliveryAddress,
        deliveryCharges,
        deliveryCity,
        deliveryType,
        discountAmount,
        discountType,
        externalOderId,
        invoiceAmount,
        merchantBranchCode,
        merchantStoreCode,
        orderWeight,
        paymentMode,
        products,
        shipmentType,
        storeReferenceNumber,
        streetNo,
        transactionNote,
      },
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          token: 'N1IwMEwzNzU4Mzg6SUREWUI5MTgzNjA=', // Ensure token is correct
        },
      }
    );

    // If the request is successful, return the response data
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      'Error during API request:',
      error.response ? error.response.data : error.message
    );

    // Return a 500 response in case of an error
    return res.status(500).json({
      message: 'Error while creating order',
      error: error.response ? error.response.data : error.message,
    });
  }
};


// const getStoreToken = async (merchantId) => {
//   try {
//     const response = await axios.get(
//       'https://oms-api.postex.sa/services/omsintegration/api/merchantStore/merchantStoreList',
//       {
//         params: { merchantId },
//       }
//     );

//     // eslint-disable-next-line no-shadow
//     const store = response.data.find((store) => store.merchantId === merchantId);
//     if (store) {
//       return store.storeToken;
//     }
//     throw new Error('Store not found');
//   } catch (error) {
//     console.error('Error fetching store token:', error);
//     throw error;
//   }
// };

module.exports = {
  getMerchantStores,
  addMerchantStores,
  editMerchantStore,
  addOrders,
  // getStoreToken, // Only if needed elsewhere
};
