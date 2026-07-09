import express from 'express';
import { saveDocumentHash, getUserDocuments, saveBulkDocumentHashes, getActivityOverview } from '../controllers/document.controller.js';
import { protect, approved } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply the protect middleware to ensure only logged-in users can save/view document hashes
// Apply approved middleware to ensure they are approved by an admin
router.post('/', protect, approved, saveDocumentHash);
router.post('/bulk', protect, approved, saveBulkDocumentHashes);
router.get('/', protect, approved, getUserDocuments);
router.get('/activity', protect, approved, getActivityOverview);

export default router;
