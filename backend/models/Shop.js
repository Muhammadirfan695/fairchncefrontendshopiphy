const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  shop: { type: String, required: true, unique: true },  // Shopify store URL
  access_token: { type: String, required: true },        // Shopify access token
  url: { type: String, required: true },                  // Store URL
  createdAt: { type: Date, default: Date.now },          // Date created
});

module.exports = mongoose.model('Shop', shopSchema);
