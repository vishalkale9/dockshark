import { Response } from 'express';
import { AuthRequest } from '../interfaces/Auth.interface.js';
import { DocumentModel } from '../models/Document.js';

export const saveDocumentHash = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { documentHash, fileName } = req.body;
        const ownerId = req.user?._id;

        if (!documentHash || !fileName) {
            res.status(400).json({ message: 'Please provide both documentHash and fileName' });
            return;
        }

        if (!ownerId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        // Check if hash already exists in the system (global check to prevent anchoring identical files)
        const existingDoc = await DocumentModel.findOne({ documentHash });
        
        if (existingDoc) {
            res.status(409).json({ 
                message: 'Document already registered',
                document: existingDoc 
            });
            return;
        }

        // Create new document record
        const newDocument = await DocumentModel.create({
            documentHash,
            fileName,
            ownerId,
            status: 'PENDING_BATCH'
        });

        res.status(201).json({
            message: 'Document hash successfully recorded for batching',
            document: newDocument
        });

    } catch (error: any) {
        console.error("Error saving document hash:", error);
        res.status(500).json({ message: 'Server error while saving document hash' });
    }
};

export const getUserDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user?._id;

        if (!ownerId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || parseInt(process.env.PAGINATION_LIMIT as string) || 5;
        const skip = (page - 1) * limit;

        // Fetch paginated documents, total count, and aggregated stats simultaneously
        const [documents, totalCount, statsData] = await Promise.all([
            DocumentModel.find({ ownerId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            DocumentModel.countDocuments({ ownerId }),
            DocumentModel.aggregate([
                { $match: { ownerId } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ])
        ]);

        let anchored = 0, pending = 0, batched = 0;
        statsData.forEach(s => {
            if (s._id === 'ANCHORED') anchored = s.count;
            if (s._id === 'PENDING_BATCH') pending = s.count;
            if (s._id === 'BATCHED') batched = s.count;
        });

        res.json({ 
            documents,
            pagination: {
                totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit)
            },
            stats: {
                total: totalCount,
                anchored,
                pending,
                batched
            }
        });
    } catch (error: any) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: 'Server error while fetching documents' });
    }
};

export const saveBulkDocumentHashes = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { documents } = req.body;
        const ownerId = req.user?._id;

        if (!Array.isArray(documents) || documents.length === 0) {
            res.status(400).json({ message: 'Please provide an array of documents' });
            return;
        }

        if (!ownerId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        // Extract incoming hashes
        const incomingHashes = documents.map(d => d.documentHash);

        // Find which hashes already exist in the system
        const existingDocs = await DocumentModel.find({ documentHash: { $in: incomingHashes } });
        const existingHashes = existingDocs.map(d => d.documentHash);

        // Filter out existing hashes from the new payload
        const newDocumentsToInsert = documents
            .filter(d => !existingHashes.includes(d.documentHash))
            .map(d => ({
                documentHash: d.documentHash,
                fileName: d.fileName,
                ownerId,
                status: 'PENDING_BATCH'
            }));

        let insertedDocs = [];
        if (newDocumentsToInsert.length > 0) {
            insertedDocs = await DocumentModel.insertMany(newDocumentsToInsert);
        }

        res.status(201).json({
            message: `Successfully queued ${insertedDocs.length} new documents for batching.`,
            insertedCount: insertedDocs.length,
            duplicatesSkipped: existingHashes.length
        });

    } catch (error: any) {
        console.error("Error in bulk saving document hashes:", error);
        res.status(500).json({ message: 'Server error while processing bulk document hashes' });
    }
};

export const getActivityOverview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user?._id;
        if (!ownerId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Fetch documents for the last 7 days
        const recentDocs = await DocumentModel.find({
            ownerId,
            createdAt: { $gte: sevenDaysAgo }
        });

        // Initialize array for the last 7 days with 0 counts
        const activityData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            activityData.push({
                date: dateStr,
                dateObj: new Date(date.setHours(0, 0, 0, 0)),
                uploads: 0,
                secured: 0
            });
        }

        // Aggregate counts
        for (const doc of recentDocs) {
            const docDate = new Date(doc.createdAt);
            docDate.setHours(0, 0, 0, 0);
            
            const dayEntry = activityData.find(d => d.dateObj.getTime() === docDate.getTime());
            if (dayEntry) {
                dayEntry.uploads += 1;
                if (doc.status === 'ANCHORED') {
                    dayEntry.secured += 1;
                }
            }
        }

        // Clean up dateObj before sending
        const formattedData = activityData.map(({ date, uploads, secured }) => ({
            date,
            uploads,
            secured
        }));

        res.json(formattedData);
    } catch (error: any) {
        console.error("Error fetching activity overview:", error);
        res.status(500).json({ message: 'Server error while fetching activity overview' });
    }
};
