import { Response } from 'express';
import { AuthRequest } from '../interfaces/Auth.interface.js';
import { DocumentModel } from '../models/Document.js';
import { blockchainService } from '../services/blockchain.service.js';

export const pushToBlockchain = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // 1. Fetch documents that are in BATCHED state
        const query: any = { status: 'BATCHED' };
        
        // Security Audit Fix: Non-admins can only anchor their own batched documents
        if (req.user?.role !== 'admin') {
            query.ownerId = req.user?._id;
        }

        const batchedDocs = await DocumentModel.find(query);

        if (batchedDocs.length === 0) {
            res.status(400).json({ message: 'No batched documents found to anchor.' });
            return;
        }

        // 2. Group them by their Merkle Root so we only send 1 transaction per root
        const rootsToDocs = new Map<string, any[]>();
        
        for (const doc of batchedDocs) {
            if (doc.merkleRoot) {
                if (!rootsToDocs.has(doc.merkleRoot)) {
                    rootsToDocs.set(doc.merkleRoot, []);
                }
                rootsToDocs.get(doc.merkleRoot)!.push(doc);
            }
        }

        const anchorResults = [];

        // 3. Anchor each unique root to the blockchain
        for (const [merkleRoot, docs] of rootsToDocs.entries()) {
            // Call the blockchain service
            const txHash = await blockchainService.anchorMerkleRoot(merkleRoot);
            
            // 4. Update the documents in MongoDB to ANCHORED with the Polygon TxHash
            const docIds = docs.map(d => d._id);
            await DocumentModel.updateMany(
                { _id: { $in: docIds } },
                { 
                    $set: { 
                        polygonTxHash: txHash,
                        status: 'ANCHORED'
                    }
                }
            );

            anchorResults.push({
                merkleRoot,
                txHash,
                documentCount: docs.length
            });
        }

        res.status(200).json({
            message: 'Successfully anchored to the blockchain',
            results: anchorResults
        });

    } catch (error: any) {
        console.error("Error anchoring to blockchain:", error);
        res.status(500).json({ message: 'Server error while anchoring to blockchain' });
    }
};

export const pushSingleToBlockchain = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { documentHash, fileName } = req.body;
        const ownerId = req.user?._id;

        if (!documentHash || !fileName) {
            res.status(400).json({ message: 'Please provide documentHash and fileName' });
            return;
        }

        // 1. Check if it already exists
        const existingDoc = await DocumentModel.findOne({ documentHash });
        if (existingDoc) {
            res.status(409).json({ message: 'Document already anchored', document: existingDoc });
            return;
        }

        // 2. Anchor directly to blockchain (treating the single hash as the root)
        const txHash = await blockchainService.anchorMerkleRoot(documentHash);

        // 3. Save as ANCHORED
        const newDocument = await DocumentModel.create({
            documentHash,
            fileName,
            ownerId,
            status: 'ANCHORED',
            merkleRoot: documentHash, // Root is just the hash itself
            polygonTxHash: txHash
        });

        res.status(201).json({
            message: 'Successfully anchored document to the blockchain',
            document: newDocument,
            txHash
        });

    } catch (error: any) {
        console.error("Error pushing single to blockchain:", error);
        res.status(500).json({ message: 'Server error while anchoring to blockchain' });
    }
};
