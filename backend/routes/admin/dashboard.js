// routes/admin/dashboard.js
const express = require('express');

const app = express();

const { fetchShopifyProducts } = require('../../utils/shopifyApi');

const Shop = require('../../models/Shop');



app.get('/admin/dashboard', async (req, res) => {
  try {
    // Get store details from the database
    const shopData = await Shop.findOne({ shop: req.query.shop });
    if (!shopData) {
      return res.status(400).send('Store not connected');
    }

    // Fetch products using stored access token
    const products = await fetchShopifyProducts(shopData.shop, shopData.accessToken);

    // Render admin panel with fetched products
    return res.render('admin/dashboard', { products });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error loading dashboard');
  }
});
