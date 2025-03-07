const express = require('express');

const router = express.Router();

const { SHOPIFY_API_KEY, SHOPIFY_REDIRECT_URI } = process.env;

router.get('/install', (req, res) => {
  const { shop } = req.query;

  if (!shop) return res.status(400).send('Missing shop parameter');

  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=read_products,write_products&redirect_uri=${SHOPIFY_REDIRECT_URI}`;

  console.log('Redirecting to Shopify install URL:', installUrl);
  return res.redirect(installUrl);
});

module.exports = router;
