import { XMarkIcon } from '@heroicons/react/24/outline';
import { Product } from '../types/product';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { name, description, price, imageUrl, attributes } = product;

  const formatAttributeValue = (value: any): string => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-6">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-64 object-contain rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="mt-2 text-gray-600">{description}</p>
            </div>

            {attributes && Object.keys(attributes).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(attributes).map(([key, value]) => (
                    <div 
                      key={key}
                      className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-gray-700">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>{' '}
                        <span className="text-gray-600">{formatAttributeValue(value)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Price</h3>
              <p className="mt-2 text-2xl font-bold text-primary-600">${price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 