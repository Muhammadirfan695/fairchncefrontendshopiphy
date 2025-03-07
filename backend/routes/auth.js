const express = require('express');
const { adminLogin, merchantLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/merchant/login', merchantLogin);

module.exports = router;
