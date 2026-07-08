import express from 'express';
import { pushToBlockchain, pushSingleToBlockchain } from '../controllers/anchor.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/push', protect, pushToBlockchain);
router.post('/push-single', protect, pushSingleToBlockchain);

export default router;
