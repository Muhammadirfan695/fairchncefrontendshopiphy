// merchantModel.js
const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  storeToken: { type: String, required: true, unique: true },
  storeName: { type: String, required: true },
  pocEmail1: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Merchant', merchantSchema);
