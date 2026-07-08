import { Response } from 'express';
import { AuthRequest } from '../interfaces/Auth.interface.js';
import { DocumentModel } from '../models/Document.js';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export const processBatch = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Ensure only an admin (or a highly trusted service) can trigger a batch. 
        // For demonstration, we'll allow it if they are logged in, but in prod this should be restricted.
        
        // 1. Fetch all pending documents
        const pendingDocs = await DocumentModel.find({ status: 'PENDING_BATCH' });

        if (pendingDocs.length === 0) {
            res.status(400).json({ message: 'No pending documents to batch.' });
            return;
        }

        // 2. Extract their hashes
        // Note: The frontend generated keccak256 strings (with or without '0x').
        // We will strip '0x' if present for tree construction, then buffer them.
        const leaves = pendingDocs.map(doc => {
            const cleanHash = doc.documentHash.replace('0x', '');
            return Buffer.from(cleanHash, 'hex');
        });

        // 3. Construct the Merkle Tree
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        
        // 4. Get the Merkle Root (adding 0x standard prefix)
        const root = tree.getRoot().toString('hex');
        const merkleRoot = `0x${root}`;

        // 5. Update all processed documents in MongoDB
        const docIds = pendingDocs.map(doc => doc._id);
        
        await DocumentModel.updateMany(
            { _id: { $in: docIds } },
            { 
                $set: { 
                    merkleRoot: merkleRoot,
                    status: 'BATCHED'
                }
            }
        );

        res.status(200).json({
            message: 'Successfully generated Merkle Root',
            merkleRoot: merkleRoot,
            documentsBatched: pendingDocs.length,
            treeLeaves: leaves.map(l => `0x${l.toString('hex')}`)
        });

    } catch (error: any) {
        console.error("Error processing Merkle batch:", error);
        res.status(500).json({ message: 'Server error while processing batch' });
    }
};
