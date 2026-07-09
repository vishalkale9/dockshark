import { ethers } from 'ethers';

import dotenv from 'dotenv';

dotenv.config();

import { DockSharkAnchorABI as contractData } from '../abi/DockSharkAnchor.js';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;
const RPC_URL = process.env.SEPOLIA_RPC_URL;

class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (!CONTRACT_ADDRESS || !PRIVATE_KEY || !RPC_URL || !contractData) {
      console.warn("Blockchain credentials or ABI not fully configured. Anchoring will be simulated.");
      console.warn(`Debug: CONTRACT_ADDRESS=${!!CONTRACT_ADDRESS}, PRIVATE_KEY=${!!PRIVATE_KEY}, RPC_URL=${!!RPC_URL}, ABI=${!!contractData}`);
      return;
    }
    try {
      this.provider = new ethers.JsonRpcProvider(RPC_URL);
      this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, contractData.abi, this.wallet);
      this.isInitialized = true;
      console.log("Blockchain Service Initialized. Connected to Sepolia.");
    } catch (error) {
      console.error("Failed to initialize Blockchain Service:", error);
    }
  }

  /**
   * Anchors a single Merkle Root to the Ethereum network via the DockSharkAnchor smart contract.
   * @param merkleRoot The Keccak-256 Merkle root of the document hashes (hex string with 0x)
   * @returns The transaction hash of the Ethereum transaction
   */
  public async anchorMerkleRoot(merkleRoot: string): Promise<string> {
    if (!this.isInitialized || !this.contract) {
      console.warn("Blockchain Service not initialized. Generating mock txHash.");
      return `0xmocktxhash_${Date.now()}`;
    }

    try {
      console.log(`Submitting Merkle Root to Blockchain: ${merkleRoot}`);
      
      // The smart contract function is anchorRoot(bytes32)
      const tx = await this.contract.anchorRoot(merkleRoot);
      console.log(`Transaction submitted! Hash: ${tx.hash}`);
      
      // Wait for 1 confirmation
      const receipt = await tx.wait(1);
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      
      return tx.hash;
    } catch (error: any) {
      console.error("Blockchain anchoring failed:", error);
      throw new Error(`Failed to anchor to blockchain: ${error.message}`);
    }
  }

  /**
   * Verifies if a Merkle Root exists on the blockchain (Zero-Trust verification)
   * @param merkleRoot The Keccak-256 Merkle root to check
   * @returns boolean true if anchored, false otherwise
   */
  public async verifyMerkleRoot(merkleRoot: string): Promise<boolean> {
    if (!this.isInitialized || !this.contract) {
      console.warn("Blockchain Service not initialized. Returning mock verification (true).");
      return true;
    }

    try {
      console.log(`Querying Blockchain for Merkle Root: ${merkleRoot}`);
      
      // The smart contract function is isAnchored(bytes32) -> bool
      const isAnchored = await this.contract.isAnchored(merkleRoot);
      console.log(`Blockchain response for ${merkleRoot}: ${isAnchored}`);
      
      return isAnchored;
    } catch (error: any) {
      console.error("Blockchain verification failed:", error);
      return false; // Safely return false if network fails or root invalid
    }
  }
}

export const blockchainService = new BlockchainService();
