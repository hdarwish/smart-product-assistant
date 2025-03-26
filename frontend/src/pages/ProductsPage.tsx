import { useState, useEffect } from 'react'
import { ProductCard } from '../components/ProductCard'
import { ProductModal } from '../components/ProductModal'
import { getAllProducts } from '../services/api'
import { Product } from '../types/product'

const ProductPerPage=12
export function ProductsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await getAllProducts(ProductPerPage, currentPage)
        setProducts(response.products)
        setTotalProducts(response.total)
      } catch (err) {
        setError('Failed to load products. Please try again.')
        console.error('Error loading products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="w-full mx-auto px-4 py-6">
      {error && (
        <div className="mb-6 p-4 bg-error-100 border border-error-500 rounded text-error-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="w-full flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-600">
            {totalProducts} products found
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-gray-600">
              Page {currentPage} of {totalProducts/ProductPerPage}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalProducts/ProductPerPage}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>

            <button
              onClick={() => handlePageChange(totalProducts/ProductPerPage)}
              disabled={currentPage === totalProducts/ProductPerPage}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </>
      ) : null}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
} 