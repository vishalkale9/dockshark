import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  documentHash: string;
  fileName: string;
  ownerId: mongoose.Types.ObjectId;
  status: 'PENDING_BATCH' | 'BATCHED' | 'ANCHORED';
  merkleRoot?: string;
  polygonTxHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    documentHash: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING_BATCH', 'BATCHED', 'ANCHORED'],
      default: 'PENDING_BATCH',
    },
    merkleRoot: {
      type: String,
      default: null,
    },
    polygonTxHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for faster queries by user and status
DocumentSchema.index({ ownerId: 1, status: 1 });

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);
