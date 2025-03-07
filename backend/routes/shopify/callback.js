const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const Shop = require('../../models/Shop'); // MongoDB model for storing Shopify data
require('dotenv').config();

const router = express.Router();

/**
 * HMAC verification function to verify Shopify request authenticity
 */
function verifyShopifyRequest(queryParams, secret) {
  const { hmac, ...params } = queryParams;

  // ✅ Correct way to encode values
  const message = Object.keys(params)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  const hash = crypto.createHmac('sha256', secret).update(message).digest('hex');
  return hash === hmac;
}

router.get('/', async (req, res) => {
  if (!verifyShopifyRequest(req.query, process.env.SHOPIFY_API_SECRET)) {
    return res.status(400).send('Invalid request');
  }

  const { code, shop } = req.query;
  if (!code || !shop) return res.status(400).send('Missing required parameters');

  try {
    // ✅ Exchange the code for an access token
    const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    });

    const { access_token } = response.data;

    // ✅ Save or update shop details in MongoDB
    const existingShop = await Shop.findOneAndUpdate(
      { shop },
      { access_token, url: shop },
      { upsert: true, new: true }
    );

    console.log(`✅ Shopify Access Token for ${shop}: ${access_token}`);

    // ✅ Redirect to frontend admin panel (here, you can pass token for session management)
    // return res.redirect(`https://admin.axoraexpress.com/dashboard?shop=${shop}&token=${access_token}`);
    // return res.redirect(`https://admin.axoraexpress.com/login?shop=${shop}&token=${access_token}`);
    return res.redirect(`https://admin.axoraexpress.com/auth/jwt/login?shop=${shop}&token=${access_token}`);

  } catch (error) {
    console.error('❌ Shopify OAuth Error:', error.response?.data || error.message);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
