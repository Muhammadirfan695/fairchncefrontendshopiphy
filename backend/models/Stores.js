const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  storeDomain: { type: String, required: true },
  accessToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
