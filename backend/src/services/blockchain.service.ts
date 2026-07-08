import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// In a real production app, you would compile the DocumentRegistry.sol
// and use its ABI here.
const abi = [
    "function anchorBatch(bytes32 _merkleRoot) external",
    "event BatchAnchored(bytes32 indexed root, uint256 timestamp)"
];

export const anchorToBlockchain = async (rootHash: string): Promise<string> => {
    // If we have a real private key and RPC URL, we execute a real transaction
    if (process.env.POLYGON_RPC_URL && process.env.PRIVATE_KEY && process.env.CONTRACT_ADDRESS) {
        try {
            const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

            const tx = await contract.anchorBatch(rootHash);
            const receipt = await tx.wait();
            return receipt.hash;
        } catch (error) {
            console.error("Blockchain anchoring failed:", error);
            throw new Error("Failed to anchor to Polygon");
        }
    } 
    
    // For local development and demonstration, we simulate the 2-second Polygon block time
    // and return a realistic-looking transaction hash.
    console.log(`[Local Simulation] Anchoring root ${rootHash} to mock Polygon node...`);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Generate a random 64-character hex string to simulate a transaction hash
            const randomHex = [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            const mockTxHash = `0x${randomHex}`;
            console.log(`[Local Simulation] Anchored successfully. TxHash: ${mockTxHash}`);
            resolve(mockTxHash);
        }, 2000); // 2 second block time simulation
    });
};
