import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middileware.js';

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", checkAuth);

// Protected routes
router.put("/update-profile", protectRoute, updateProfile);

export default router;