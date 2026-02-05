import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  embedding?: number[];
  attributes: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  attributes: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
  embedding: {
    type: [Number],
    required: false,
    // Note: Create a vector search index on this field in MongoDB Atlas
    // For example:
    // { "name": "vector_index", "type": "vector", "fields": [{ "type": "vector", "path": "embedding", "numDimensions": 1536, "similarity": "cosine" }] }
  },
}, {
  timestamps: true,
  versionKey: false,
});

// Add text index for search functionality
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text' 
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema); 