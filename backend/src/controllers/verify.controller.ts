import { Request, Response } from 'express';
import { DocumentModel } from '../models/Document.js';
import { blockchainService } from '../services/blockchain.service.js';

export const verifyDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const { documentHash } = req.body;

        if (!documentHash) {
            res.status(400).json({ message: 'Please provide a documentHash' });
            return;
        }

        // 1. Search for the exact hash in the database
        const document = await DocumentModel.findOne({ documentHash }).populate('ownerId', 'name email');

        // 2. If it doesn't exist, it's forged or not registered
        if (!document) {
            res.status(404).json({ 
                verified: false,
                message: 'Document Not Found. The document has been tampered with or does not exist.' 
            });
            return;
        }

        // 3. If it exists but hasn't been anchored yet
        if (document.status !== 'ANCHORED' || !document.merkleRoot) {
            res.status(400).json({ 
                verified: false,
                message: `Document found, but it is currently in '${document.status}' state. It has not been permanently anchored to the blockchain yet.` 
            });
            return;
        }

        // 4. Zero-Trust Check: Query the Blockchain!
        const isAnchoredOnChain = await blockchainService.verifyMerkleRoot(document.merkleRoot);
        
        if (!isAnchoredOnChain) {
            res.status(404).json({
                verified: false,
                message: 'Blockchain Verification Failed. The cryptographic proof does not exist on the Sepolia network.'
            });
            return;
        }

        // 5. Success! The document is perfectly valid and anchored.
        res.status(200).json({
            verified: true,
            message: 'Cryptographic Proof Verified on Sepolia Blockchain',
            data: {
                fileName: document.fileName,
                documentHash: document.documentHash,
                merkleRoot: document.merkleRoot,
                polygonTxHash: document.polygonTxHash,
                timestamp: document.updatedAt, // Using updatedAt as the anchor timestamp
                owner: (document.ownerId as any)?.name || 'Unknown',
                network: 'Ethereum Sepolia'
            }
        });

    } catch (error: any) {
        console.error("Error verifying document:", error);
        res.status(500).json({ message: 'Server error while verifying document' });
    }
};
