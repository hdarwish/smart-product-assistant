export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  attributes: {
    color?: string;
    size?: string;
    rating?: number;
    inStock?: boolean;
    [key: string]: any;
  };
}

export interface SearchResponse {
  query: string;
  searchAttributes: {
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
  };
  total: number;
  products: Product[];
} 