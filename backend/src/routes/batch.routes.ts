import express from 'express';
import { processBatch } from '../controllers/batch.controller.js';
import { protect, approved } from '../middlewares/auth.middleware.js';

const router = express.Router();

// In a real app, this should be protect AND admin middleware.
// We'll use protect and approved so the dashboard button can trigger it for demo purposes.
router.post('/process', protect, approved, processBatch);

export default router;
