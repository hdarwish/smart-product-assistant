import OpenAI from 'openai';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

interface SearchAttributes {
  keywords: string[];
  categories: string[];
  minPrice: number | null;
  maxPrice: number | null;
  attributes: {
    color: string | null;
    size: string | null;
    rating: number | null;
    inStock: boolean | null;
  };
}

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.error('OPENAI_API_KEY is not set in environment variables');
      throw new Error('OPENAI_API_KEY is required');
    }

    this.openai = new OpenAI({
      apiKey,
    });
  }

  async extractSearchAttributes(query: string): Promise<SearchAttributes> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Extract search criteria from the user query. Return JSON with the following structure:
            {
              "keywords": ["word1", "word2"],
              "categories": ["category1", "category2"],
              "minPrice": number or null,
              "maxPrice": number or null,
              "attributes": {
                "color": string or null,
                "size": string or null,
                "rating": number or null,
                "inStock": boolean or null
              }
            }
            
            Important rules:
            1. Available categories are: Beauty, Fragrances, Furniture, Groceries, Home Decoration, 
               Kitchen Accessories, Laptops, Mens Shirts, Mens Shoes, Mens Watches, Mobile Accessories, 
               Motorcycle, Skin Care, Smartphones, Sports Accessories, Sunglasses, Tablets, Tops, 
               Vehicle, Womens Bags, Womens Dresses, Womens Jewellery, Womens Shoes, Womens Watches
            
            2. Map product types to correct categories:
               - Furniture items (sofa, chair, table) → Furniture
               - Electronics (phone, tablet, laptop) → Smartphones/Tablets/Laptops
               - Clothing items → Mens/Womens categories based on type
               - Beauty items → Beauty or Skin Care
               - Accessories → appropriate category (Mobile/Sports/etc.)
            
            3. minPrice and maxPrice must be numbers or null
            4. rating must be a number between 1 and 5 or null
            5. keywords should not include price numbers or attribute values
            6. Always try to map to the most specific category available
            
            Example mappings:
            - "blue sofa" → categories: ["Furniture"], attributes: {color: "blue"}
            - "expensive laptop" → categories: ["Laptops"], maxPrice: 2000
            - "women's dress" → categories: ["Womens Dresses"]
            - "beauty cream" → categories: ["Beauty", "Skin Care"]
            - "men's watch" → categories: ["Mens Watches"]`
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const rawResponse = JSON.parse(completion.choices[0].message.content || '{}');
      
      // Clean and validate the response
      const cleanedCategories = Array.isArray(rawResponse.categories) 
        ? rawResponse.categories.filter((cat: string) => 
            ['Beauty', 'Fragrances', 'Furniture', 'Groceries', 'Home Decoration', 
             'Kitchen Accessories', 'Laptops', 'Mens Shirts', 'Mens Shoes', 'Mens Watches', 
             'Mobile Accessories', 'Motorcycle', 'Skin Care', 'Smartphones', 
             'Sports Accessories', 'Sunglasses', 'Tablets', 'Tops', 'Vehicle', 
             'Womens Bags', 'Womens Dresses', 'Womens Jewellery', 'Womens Shoes', 
             'Womens Watches'].includes(cat)
          )
        : [];
      
      return {
        keywords: Array.isArray(rawResponse.keywords) ? rawResponse.keywords : [],
        categories: cleanedCategories,
        minPrice: typeof rawResponse.minPrice === 'number' ? rawResponse.minPrice : null,
        maxPrice: typeof rawResponse.maxPrice === 'number' ? rawResponse.maxPrice : null,
        attributes: {
          color: typeof rawResponse.attributes?.color === 'string' ? rawResponse.attributes.color : null,
          size: typeof rawResponse.attributes?.size === 'string' ? rawResponse.attributes.size : null,
          rating: typeof rawResponse.attributes?.rating === 'number' ? rawResponse.attributes.rating : null,
          inStock: typeof rawResponse.attributes?.inStock === 'boolean' ? rawResponse.attributes.inStock : null
        }
      };
    } catch (error) {
      logger.error('Error extracting search attributes:', error);
      // Return basic keyword search if extraction fails
      return {
        keywords: query.toLowerCase().split(' '),
        categories: [],
        minPrice: null,
        maxPrice: null,
        attributes: {
          color: null,
          size: null,
          rating: null,
          inStock: null
        }
      };
    }
  }

  buildMongoQuery(attributes: SearchAttributes) {
    const conditions: any[] = [];

    // Text search for keywords (using MongoDB text index)
    if (attributes.keywords.length > 0) {
      conditions.push({
        $text: {
          $search: attributes.keywords.join(' '),
          $caseSensitive: false
        }
      });
    }

    // Add price range
    if (typeof attributes.maxPrice === 'number' || typeof attributes.minPrice === 'number') {
      const priceQuery: any = {};
      if (typeof attributes.minPrice === 'number') priceQuery.$gte = attributes.minPrice;
      if (typeof attributes.maxPrice === 'number') priceQuery.$lte = attributes.maxPrice;
      conditions.push({ price: priceQuery });
    }

    // Handle attributes
    const { color, size, rating, inStock } = attributes.attributes;

    // For Map type attributes, we need to use dot notation
    if (color) {
      conditions.push({
        $or: [
          { "attributes.color": { $regex: color, $options: 'i' } },
          { description: { $regex: color, $options: 'i' } },
          { name: { $regex: color, $options: 'i' } }
        ]
      });
    }

    if (size) {
      conditions.push({ "attributes.size": { $regex: size, $options: 'i' } });
    }

    if (typeof rating === 'number' && rating > 0) {
      conditions.push({ "attributes.rating": { $gte: rating } });
    }

    if (typeof inStock === 'boolean') {
      conditions.push({ "attributes.inStock": inStock });
    }

    // Add category filter if present
    if (attributes.categories && attributes.categories.length > 0) {
      conditions.push({
        category: { 
          $in: attributes.categories.map(cat => new RegExp(cat, 'i'))
        }
      });
    }

    // Log the final query for debugging
    logger.debug('Search conditions: %j', conditions);

    // If no conditions, return empty query to match all
    if (conditions.length === 0) {
      return {};
    }

    // Combine all conditions with $and
    return { $and: conditions };
  }

  async generateProductMatches(query: string, products: any[]): Promise<any[]> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a product matching assistant. Analyze the products and rank them based on relevance to the query.
                     Return the top 5 most relevant matches with explanations.
                     Format response as JSON with structure: {
                       "matches": [{
                         "productId": "id",
                         "relevanceScore": number between 0-1,
                         "explanation": "brief explanation of why this product matches"
                       }]
                     }`
          },
          {
            role: "user",
            content: `Query: ${query}\nProducts: ${JSON.stringify(products)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{"matches": []}');
      
      return response.matches.map((match: any) => {
        const product = products.find(p => p._id.toString() === match.productId);
        return {
          ...product,
          relevanceScore: match.relevanceScore,
          explanation: match.explanation
        };
      });

    } catch (error: any) {
      logger.error('Error generating product matches:', error.message);
      throw new Error('Failed to generate product matches');
    }
  }
}

export const openAIService = new OpenAIService(); 