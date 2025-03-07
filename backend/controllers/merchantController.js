// const Merchant = require('../models/Merchant');  // Assuming you have a Merchant model

// const getMerchant = async (req, res) => {
//   try {
//     const userId = req.user.id; // Get user ID from decoded token
//     const merchant = await Merchant.findOne({ userId }); // Fetch merchant data

//     if (!merchant) {
//       return res.status(404).send('Merchant not found');
//     }

//     return res.status(200).json(merchant);  // Ensure the response is returned here
//   } catch (err) {
//     return res.status(500).send('Server error');  // Ensure the response is returned here
//   }
// };

// module.exports = { getMerchant };
