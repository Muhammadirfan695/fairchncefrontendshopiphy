const mongoose = require('mongoose');

const MerchantAddSchema = new mongoose.Schema({
  pocName: { type: String, required: true },
  pocEmail1: { type: String, required: true },
  pocContact1: { type: String, required: true },
  pocContact2: { type: String, required: false },
  cityName: { type: String, required: true },
  password: { type: String, unique: true, required: true },
  storeCode: { type: String, required: true },
  storeName: { type: String, required: true },
  storeUrl: { type: String, required: true },
  active: { type: Boolean, default: true },
  postexStatusCode: { type: Number }, // Save Postex response status code
  postexStatusMessage: { type: String }, // Save Postex response status message
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MerchantAdd = mongoose.model('MerchantAdd', MerchantAddSchema);
module.exports = MerchantAdd;
