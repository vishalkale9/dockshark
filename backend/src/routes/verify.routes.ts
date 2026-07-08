import express from 'express';
import { verifyDocument } from '../controllers/verify.controller.js';

const router = express.Router();

// Note: No 'protect' middleware here. This must be a strictly public endpoint.
router.post('/', verifyDocument);

export default router;
