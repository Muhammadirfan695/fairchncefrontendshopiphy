const express = require('express');

const axios = require('axios');

const MerchantAdd = require('../models/MerchantAdd');

const app = express();




const verifyShopifyRequest = (req, res, next) => {
  const { hmac, ...params } = req.query;

  const secret = process.env.SHOPIFY_API_SECRET;
  const queryString = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  const hash = crypto
      .createHmac('sha256', secret)
      .update(queryString)
      .digest('hex');

  if (hash === hmac) {
      next(); // Verification successful, proceed with install
  } else {
      res.status(400).send('Request could not be verified');
  }
};

const storeShopDetails = async (shop, accessToken) => {
  // Save the shop and token to database
  // For example: await Store.create({ shop, accessToken });
};





















































// Utility function to fetch products
const getShopifyProducts = async (shopUrl, accessToken) => {
  try {
    const response = await axios.get(
      `https://${shopUrl}/admin/api/2023-01/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      }
    );
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw new Error('Failed to fetch products from Shopify');
  }
};

// Fetch products for a specific merchant
app.get('/admin/shopify/products/:storeUrl', async (req, res) => {
  const { storeUrl } = req.params;

  try {
    // Check if merchant exists
    const merchant = await MerchantAdd.findOne({ storeUrl });
    if (!merchant || !merchant.shopifyAccessToken) {
      return res.status(400).json({ message: 'Merchant or access token not found' });
    }

    // Fetch products
    const products = await getShopifyProducts(storeUrl, merchant.shopifyAccessToken);
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return res.status(500).json({ message: 'Error fetching products' });
  }
});

// Fetch Shopify data dynamically
exports.fetchShopifyData = async (req, res) => {
  const { pocEmail1 } = req.body;

  try {
    const merchant = await MerchantAdd.findOne({ pocEmail1 });
    if (!merchant) {
      return res.status(400).json({ message: 'Merchant not found' });
    }

    const shopifyUrl = merchant.storeUrl;
    const token = merchant.shopifyAccessToken;

    const response = await axios.get(
      `https://${shopifyUrl}/admin/api/2023-01/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': token,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching Shopify data:', error.message);
    return res.status(500).json({ message: 'Error fetching Shopify data' });
  }
};









// ==================================

// const getShopifyanalytics = async (req, res) => {
//   try {
//     console.log('Fetching Shopify reports (analytics)...');

//     const response = await axios.get(`${SHOPIFY_URL}reports.json`, {
//       headers: {
//         'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
//       },
//     });

//     console.log('Shopify Analytics Response:', response.data);
//     res.status(200).json(response.data); // Send response to frontend
//   } catch (error) {
//     console.error(
//       'Error fetching Shopify analytics data:',
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({ error: 'Failed to fetch Shopify analytics data' });
//   }
// };

// ====================================================================

// const getShopifyOrders = async (req, res) => {
//   try {
//     console.log('Fetching Shopify orders...');

//     // Shopify se orders ka data fetch karo
//     const response = await axios.get(`${SHOPIFY_URL}orders.json?status=any`, {
//       headers: {
//         'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
//       },
//     });

//     console.log('Shopify Orders Response:', response.data);

//     // Total Orders
//     const totalOrders = response.data.orders.length;

//     // Today's Orders
//     const todayOrders = response.data.orders.filter((order) => {
//       const orderDate = new Date(order.created_at);
//       const todayDate = new Date();
//       return orderDate.toDateString() === todayDate.toDateString();
//     }).length;

//     // Orders in Progress (Pending or Unfulfilled)
//     const ordersInProgress = response.data.orders.filter(
//       (order) => order.financial_status === 'pending' || order.fulfillment_status === 'unfulfilled'
//     ).length;

//     // Orders Returned (Fulfillment status is returned)
//     const ordersReturned = response.data.orders.filter(
//       (order) => order.fulfillment_status === 'returned'
//     ).length;

//     // Returning the stats to frontend
//     res.status(200).json({
//       totalOrders,
//       todayOrders,
//       ordersInProgress,
//       ordersReturned,
//     });
//   } catch (error) {
//     console.error(
//       'Error fetching Shopify orders:',
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({ error: 'Failed to fetch orders from Shopify' });
//   }
// };

// // ====================================================================

// // Get Today's Orders
// const getTodaysOrders = async (req, res) => {
//   const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
//   try {
//     console.log("Fetching Today's Shopify orders...");
//     const response = await axios.get(
//       `${SHOPIFY_URL}orders.json?created_at_min=${today}T00:00:00Z&status=any`,
//       {
//         headers: {
//           'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
//         },
//       }
//     );

//     console.log("Today's Shopify Orders Response:", response.data);
//     res.status(200).json({ todaysOrders: response.data.orders.length });
//   } catch (error) {
//     console.error(
//       "Error fetching today's Shopify orders:",
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({ error: "Failed to fetch today's orders from Shopify" });
//   }
// };

// // ====================================================================

// // Get Orders in Progress (Open or Unfulfilled)
// const getOrdersInProgress = async (req, res) => {
//   try {
//     console.log('Fetching Orders in Progress...');
//     const response = await axios.get(`${SHOPIFY_URL}orders.json?status=open`, {
//       headers: {
//         'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
//       },
//     });

//     console.log('Orders in Progress Response:', response.data);
//     res.status(200).json({ ordersInProgress: response.data.orders.length });
//   } catch (error) {
//     console.error(
//       'Error fetching orders in progress:',
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({ error: 'Failed to fetch orders in progress from Shopify' });
//   }
// };

// // ====================================================================

// // Get Orders Return (Cancelled)
// const getOrdersReturn = async (req, res) => {
//   try {
//     console.log('Fetching Returned Orders...');
//     const response = await axios.get(`${SHOPIFY_URL}orders.json?status=cancelled`, {
//       headers: {
//         'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
//       },
//     });

//     console.log('Returned Orders Response:', response.data);
//     res.status(200).json({ ordersReturned: response.data.orders.length });
//   } catch (error) {
//     console.error(
//       'Error fetching returned orders:',
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({ error: 'Failed to fetch returned orders from Shopify' });
//   }
// };

module.exports = {
  // getShopifyOrders,
  getShopifyProducts,
  // getTodaysOrders,
  // getOrdersInProgress,
  // getOrdersReturn,
  verifyShopifyRequest,
  storeShopDetails
};
