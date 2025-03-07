const express = require('backend/middleware/node_modules/@types/express');
const router = express.Router();
const {
  conversations,
  getconversationbyid,
  createConversation,
} = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware').default;

router
  .get('/list', protect, conversations)
  .get('/', protect, getconversationbyid)
  .post('/create', protect, createConversation);

module.exports = router;
