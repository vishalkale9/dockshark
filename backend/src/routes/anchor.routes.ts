import express from 'express';
import { pushToBlockchain, pushSingleToBlockchain } from '../controllers/anchor.controller.js';
import { protect, approved } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/push', protect, approved, pushToBlockchain);
router.post('/push-single', protect, approved, pushSingleToBlockchain);

export default router;
