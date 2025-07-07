import express from 'express';
import { protectRoute } from '../middleware/auth.middileware.js';
import { getMessages, getUserForSidebar, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

// User-related routes
router.get('/users', protectRoute, getUserForSidebar);

// Message-related routes
router.post('/send/:receiverId', protectRoute, sendMessage);
router.get('/chat/:chatId', protectRoute, getMessages);

// Error handling for invalid routes
router.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        code: 'ROUTE_NOT_FOUND'
    });
});

export default router;