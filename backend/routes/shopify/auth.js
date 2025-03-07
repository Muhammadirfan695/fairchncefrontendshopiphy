const express = require('express');

const axios = require('axios');

const Shop = require('../../models/Shop'); // Mongoose model

const router = express.Router();

router.get('/auth/callback', async (req, res) => {
  const { shop, code } = req.query;

  if (!shop || !code) {
    return res.status(400).json({ error: 'Missing shop or code parameter' });
  }

  try {
    // Shopify se Access Token lena
    const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    });

    const accessToken = response.data.access_token;

    // Check karo agar shop exist karti hai to update karo, warna insert karo
    let shopData = await Shop.findOne({ shop });

    if (shopData) {
      shopData.accessToken = accessToken;
      await shopData.save();
    } else {
      shopData = await Shop.create({ shop, accessToken });
    }

    console.log(`Shop ${shop} saved successfully with token!`);

    // Redirect to frontend with token
    const redirectURL = `https://admin.axoraexpress.com/auth-success?shop=${shop}&token=${accessToken}`;
    return res.redirect(redirectURL);
  } catch (error) {
    console.error('Error fetching access token:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
