import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
    sendMessage,
    getConversations,
    getMessages,
    searchUsers,
    markMessagesAsRead
} from '../controllers/chatController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Chat routes
router.post('/send', sendMessage);
router.get('/conversations', getConversations);
router.get('/messages/:otherUserId/:otherUserType', getMessages);
router.get('/search', searchUsers);
router.post('/mark-read/:otherUserId/:otherUserType', markMessagesAsRead);

export default router; 