import { Response } from 'express';
import { AuthRequest } from '../interfaces/Auth.interface.js';
import { DocumentModel } from '../models/Document.js';
import { blockchainService } from '../services/blockchain.service.js';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export const processBatch = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user?._id;

        if (!ownerId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        // 1. Fetch all pending documents for this user
        const pendingDocs = await DocumentModel.find({
            ownerId,
            status: 'PENDING_BATCH'
        });

        if (pendingDocs.length === 0) {
            res.status(400).json({ message: 'No pending documents to batch.' });
            return;
        }

        // 2. Generate the Merkle Tree
        // The hashes are stored as hex strings in the database
        const leaves = pendingDocs.map(doc => doc.documentHash);
        
        // Build the tree (sortPairs is essential for reproducible roots regardless of order)
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const merkleRoot = tree.getHexRoot();

        console.log(`Processing Batch of ${pendingDocs.length} documents. Merkle Root: ${merkleRoot}`);

        // 3. Anchor to the Blockchain
        // This connects to Sepolia and pays the gas fee
        const txHash = await blockchainService.anchorMerkleRoot(merkleRoot);

        // 4. Update MongoDB
        const docIds = pendingDocs.map(doc => doc._id);
        await DocumentModel.updateMany(
            { _id: { $in: docIds } },
            { 
                $set: { 
                    status: 'ANCHORED', 
                    merkleRoot: merkleRoot, 
                    polygonTxHash: txHash 
                } 
            }
        );

        res.status(200).json({
            message: 'Batch successfully anchored to the blockchain!',
            documentsBatched: pendingDocs.length,
            merkleRoot: merkleRoot,
            txHash: txHash
        });

    } catch (error: any) {
        console.error("Error processing batch:", error);
        res.status(500).json({ 
            message: 'Failed to process batch on the blockchain',
            error: error.message 
        });
    }
};
