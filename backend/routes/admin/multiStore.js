const express = require('express');

const app = express();

const Shop = require("../../models/Shop");

// routes/admin/multiStore.js
app.get('/admin/multi-store', async (req, res) => {
    try {
      // Fetch all stores connected to the admin
      const allStores = await Shop.find();
      res.render('admin/multiStore', { allStores });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching stores');
    }
  });
  