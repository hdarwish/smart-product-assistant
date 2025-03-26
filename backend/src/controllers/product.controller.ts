import type { RequestHandler } from 'express';
import type { PipelineStage } from 'mongoose';
import { Product } from '../models/Product';
import { openAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const productController = {
  // Get all products
  getAllProducts: (async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 12;
      const page = parseInt(req.query.page as string) || 1;
      const offset = (page - 1) * limit;

      // Get total count for pagination
      const total = await Product.countDocuments();
      
      const products = await Product.find()
        .sort({ price: 1 })
        .skip(offset)
        .limit(limit);
      
      res.json({
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        products
      });
    } catch (error) {
      logger.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }) as RequestHandler,

  // Get single product by ID
  getProductById: (async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      logger.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }) as RequestHandler,

  // Create new product
  createProduct: (async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      logger.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }) as RequestHandler,

  // Update product
  updateProduct: (async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      logger.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }) as RequestHandler,

  // Delete product
  deleteProduct: (async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      logger.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }) as RequestHandler,

  // Search products with natural language
  searchProducts: (async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      // Extract search attributes using OpenAI
      const searchAttributes = await openAIService.extractSearchAttributes(query);
      logger.debug('Extracted search attributes: %j', searchAttributes);

      // Build MongoDB query using the extracted attributes
      const mongoQuery = openAIService.buildMongoQuery(searchAttributes);
      logger.debug('MongoDB query: %j', mongoQuery);

      // Execute search with the query
      const products = await Product.find(mongoQuery)
        .select('name description price category imageUrl attributes')
        .sort({ price: 1 }) // Sort by price ascending as a default sort
        .limit(10);

      logger.debug('Found %d products', products.length);

      if (products.length === 0) {
        return res.json({
          query,
          products: [],
          message: 'No products found matching your criteria'
        });
      }

      res.json({
        query,
        searchAttributes,
        total: products.length,
        products
      });

    } catch (error) {
      logger.error('Error searching products: %s', error instanceof Error ? error.message : error);
      res.status(500).json({ error: 'Failed to search products' });
    }
  }) as RequestHandler
}; 