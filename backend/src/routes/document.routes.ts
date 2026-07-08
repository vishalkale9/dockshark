import express from 'express';
import { saveDocumentHash, getUserDocuments, saveBulkDocumentHashes } from '../controllers/document.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply the protect middleware to ensure only logged-in users can save/view document hashes
router.post('/', protect, saveDocumentHash);
router.post('/bulk', protect, saveBulkDocumentHashes);
router.get('/', protect, getUserDocuments);

export default router;
