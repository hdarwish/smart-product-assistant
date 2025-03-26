import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { name, description, price, imageUrl } = product;

  return (
    <div className="bg-white h-[400px] p-4 flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="h-48 mb-4">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain rounded-md"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 h-12">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{description.substring(0,50)}...</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-primary-600">${price.toFixed(2)}</span>
          <button
            onClick={() => onClick(product)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}; 