import mongoose from 'mongoose';
import { Product } from '../../models/Product';
import { logger } from '../../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  'Beauty',
  'Fragrances',
  'Furniture',
  'Groceries',
  'Home Decoration',
  'Kitchen Accessories',
  'Laptops',
  'Mens Shirts',
  'Mens Shoes',
  'Mens Watches',
  'Mobile Accessories',
  'Motorcycle',
  'Skin Care',
  'Smartphones',
  'Sports Accessories',
  'Sunglasses',
  'Tablets',
  'Tops',
  'Vehicle',
  'Womens Bags',
  'Womens Dresses',
  'Womens Jewellery',
  'Womens Shoes',
  'Womens Watches'
];

const productTemplates = [
  {
    name: 'Face Cream',
    description: 'Hydrating face cream with natural ingredients',
    priceRange: { min: 19, max: 79 },
    category: 'Beauty'
  },
  {
    name: 'Luxury Perfume',
    description: 'Long-lasting fragrance with premium ingredients',
    priceRange: { min: 49, max: 299 },
    category: 'Fragrances'
  },
  {
    name: 'Modern Sofa',
    description: 'Comfortable and stylish modern sofa with premium materials',
    priceRange: { min: 499, max: 1999 },
    category: 'Furniture'
  },
  {
    name: 'Organic Groceries',
    description: 'Fresh organic produce and pantry staples',
    priceRange: { min: 5, max: 50 },
    category: 'Groceries'
  },
  {
    name: 'Wall Art',
    description: 'Contemporary wall art pieces for home decoration',
    priceRange: { min: 29, max: 199 },
    category: 'Home Decoration'
  },
  {
    name: 'Kitchen Set',
    description: 'Complete set of essential kitchen accessories',
    priceRange: { min: 49, max: 299 },
    category: 'Kitchen Accessories'
  },
  {
    name: 'Premium Laptop',
    description: 'High-performance laptop with latest specifications',
    priceRange: { min: 799, max: 2499 },
    category: 'Laptops'
  },
  {
    name: 'Classic Shirt',
    description: 'Premium cotton shirt with modern fit',
    priceRange: { min: 29, max: 99 },
    category: 'Mens Shirts'
  },
  {
    name: 'Running Shoes',
    description: 'Professional running shoes with advanced cushioning',
    priceRange: { min: 79, max: 199 },
    category: 'Mens Shoes'
  },
  {
    name: 'Luxury Watch',
    description: 'Elegant luxury watch with premium movement',
    priceRange: { min: 199, max: 999 },
    category: 'Mens Watches'
  },
  {
    name: 'Phone Case',
    description: 'Protective phone case with stylish design',
    priceRange: { min: 15, max: 49 },
    category: 'Mobile Accessories'
  },
  {
    name: 'Motorcycle Helmet',
    description: 'Safety-certified motorcycle helmet with ventilation',
    priceRange: { min: 99, max: 299 },
    category: 'Motorcycle'
  },
  {
    name: 'Face Serum',
    description: 'Anti-aging serum with vitamin C',
    priceRange: { min: 29, max: 149 },
    category: 'Skin Care'
  },
  {
    name: 'Smartphone',
    description: 'Latest smartphone with advanced camera system',
    priceRange: { min: 499, max: 1299 },
    category: 'Smartphones'
  },
  {
    name: 'Sports Bag',
    description: 'Durable sports bag with multiple compartments',
    priceRange: { min: 29, max: 99 },
    category: 'Sports Accessories'
  },
  {
    name: 'Designer Sunglasses',
    description: 'UV-protected designer sunglasses',
    priceRange: { min: 79, max: 299 },
    category: 'Sunglasses'
  },
  {
    name: 'Tablet',
    description: 'Versatile tablet for work and entertainment',
    priceRange: { min: 299, max: 999 },
    category: 'Tablets'
  },
  {
    name: 'Casual Top',
    description: 'Comfortable and stylish casual top',
    priceRange: { min: 19, max: 59 },
    category: 'Tops'
  },
  {
    name: 'Car Accessories',
    description: 'Essential car accessories and maintenance items',
    priceRange: { min: 9, max: 99 },
    category: 'Vehicle'
  },
  {
    name: 'Designer Bag',
    description: 'Luxurious designer handbag with premium materials',
    priceRange: { min: 199, max: 999 },
    category: 'Womens Bags'
  },
  {
    name: 'Evening Dress',
    description: 'Elegant evening dress for special occasions',
    priceRange: { min: 79, max: 299 },
    category: 'Womens Dresses'
  },
  {
    name: 'Diamond Necklace',
    description: 'Stunning diamond necklace with precious metals',
    priceRange: { min: 299, max: 1999 },
    category: 'Womens Jewellery'
  },
  {
    name: 'High Heels',
    description: 'Comfortable high heels with cushioned sole',
    priceRange: { min: 49, max: 199 },
    category: 'Womens Shoes'
  },
  {
    name: 'Luxury Watch',
    description: 'Elegant luxury watch with premium movement',
    priceRange: { min: 199, max: 999 },
    category: 'Womens Watches'
  }
];

const generateRandomProduct = (category: string, index: number) => {
  // Filter templates for the current category
  const categoryTemplates = productTemplates.filter(template => template.category === category);
  const template = categoryTemplates[index % categoryTemplates.length];
  
  const price = Math.floor(
    Math.random() * (template.priceRange.max - template.priceRange.min) + template.priceRange.min
  );
  
  const colors = ['Black', 'White', 'Silver', 'Blue', 'Red', 'Gold', 'Brown', 'Green', 'Purple'];
  const sizes = ['Small', 'Medium', 'Large', 'XL', 'XXL'];
  
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = sizes[Math.floor(Math.random() * sizes.length)];
  const inStock = Math.random() > 0.2;
  const rating = (Math.random() * 3 + 2).toFixed(1);
  const manufacturer = `${category} Pro`;
  const modelYear = 2023 + Math.floor(Math.random() * 2);
  
  return {
    name: `${template.name} ${color} ${size} `,
    description: `${template.description} Available in ${color} color and ${size} size. ${inStock ? 'In stock' : 'Out of stock'}. Rated ${rating}/5.0 by our customers.`,
    price,
    category,
    imageUrl: `https://placehold.co/400x300?text=${encodeURIComponent(`${color} ${template.name}`)}`,
    attributes: {
      color,
      size,
      inStock,
      rating,
      manufacturer,
      modelYear
    }
  };
};

export const seedProducts = async () => {
  try {
    // Connect to MongoDB if not connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Check if products exist
    const existingProductCount = await Product.countDocuments();
    
    if (existingProductCount > 0) {
      logger.info(`Database already has ${existingProductCount} products, skipping seed`);
      return;
    }

    // Generate products for each category
    const products = categories.flatMap((category) =>
      Array.from({ length: 20 }, (_, index) => generateRandomProduct(category, index))
    );

    // Insert products
    await Product.insertMany(products);
    logger.info(`Successfully seeded ${products.length} products`);

  } catch (error) {
    logger.error('Error seeding products:', error);
    throw error;
  }
};

// Run seeder if this file is run directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      logger.info('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
} 