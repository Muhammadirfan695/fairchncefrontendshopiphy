const express = require('express');
const {
  addMerchantStores,
  getMerchantStores,
  editMerchantStore,
  addOrders,
} = require('../controllers/postexController');

const router = express.Router();

router.get('/merchantStoreList', getMerchantStores);
router.post('/createMerchantStore', addMerchantStores); // This handles both saving to MongoDB and Postex API
router.patch('/updateMerchantStore', editMerchantStore);
router.post('/createOrders', addOrders);
module.exports = router;
