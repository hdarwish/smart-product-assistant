import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to all routes
router.use(rateLimiter);

// CRUD routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Search route
router.post('/search', productController.searchProducts);

export default router; 