// /api/shopify/data.js
const express = require('express');
const axios = require('axios');
const Merchant = require('../models/Merchant');

const router = express.Router();

router.get('/orders', async (req, res) => {
  const { shop } = req.query;
  if (!shop) {
    return res.status(400).send('Missing shop parameter');
  }

  try {
    const merchant = await Merchant.findOne({ shop });
    if (!merchant) {
      return res.status(404).send('Merchant not found');
    }

    const response = await axios.get(`https://${shop}/admin/api/2023-01/orders.json`, {
      headers: {
        'X-Shopify-Access-Token': merchant.access_token,
      },
    });

   return res.json(response.data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.get('/products', async (req, res) => {
  const { shop } = req.query;
  if (!shop) {
    return res.status(400).send('Missing shop parameter');
  }

  try {
    const merchant = await Merchant.findOne({ shop });
    if (!merchant) {
      return res.status(404).send('Merchant not found');
    }

    const response = await axios.get(`https://${shop}/admin/api/2023-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': merchant.access_token,
      },
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Error fetching products' });
  }
});

module.exports = router;


// const axios = require('axios');

// const express = require('express');

// const router = express.Router();

// // Assuming you have a function to fetch shop details from the database
// const { getShopDetails } = require('../helpers/shopifyHelper');

// // Orders Route
// router.get('/orders', async (req, res) => {
//   const { shop } = req.query; // Pass shop name as a query parameter (e.g., ?shop=myshop.myshopify.com)
//   if (!shop) {
//     return res.status(400).json({ message: 'Shop parameter is required' });
//   }

//   try {
//     // Get shop details from the database
//     const shopDetails = await getShopDetails(shop);

//     if (!shopDetails || !shopDetails.accessToken) {
//       return res.status(404).json({ message: 'Shop not found or access token missing' });
//     }

//     const SHOPIFY_API_URL = `https://${shop}/admin/api/2023-01`;
//     const response = await axios.get(`${SHOPIFY_API_URL}/orders.json`, {
//       headers: {
//         'X-Shopify-Access-Token': shopDetails.accessToken,
//       },
//     });

//    return res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     return res.status(500).json({ message: 'Error fetching orders' });
//   }
// });

// // Products Route
// router.get('/products', async (req, res) => {
//   const { shop } = req.query; // Pass shop name as a query parameter (e.g., ?shop=myshop.myshopify.com)
//   if (!shop) {
//     return res.status(400).json({ message: 'Shop parameter is required' });
//   }

//   try {
//     // Get shop details from the database
//     const shopDetails = await getShopDetails(shop);

//     if (!shopDetails || !shopDetails.accessToken) {
//       return res.status(404).json({ message: 'Shop not found or access token missing' });
//     }

//     const SHOPIFY_API_URL = `https://${shop}/admin/api/2023-01`;
//     const response = await axios.get(`${SHOPIFY_API_URL}/products.json`, {
//       headers: {
//         'X-Shopify-Access-Token': shopDetails.accessToken,
//       },
//     });

//    return res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return res.status(500).json({ message: 'Error fetching products' });
//   }
// });

// module.exports = router;
