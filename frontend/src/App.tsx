import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { SearchBar } from './components/SearchBar'
import { ProductCard } from './components/ProductCard'
import { ProductModal } from './components/ProductModal'
import { searchProducts } from './services/api'
import { Product } from './types/product'
import { ProductsPage } from './pages/ProductsPage'
import './App.css'

function NavLinks() {
  const location = useLocation()

  return (
    <nav className="flex gap-4">
      <Link 
        to="/" 
        className={`hover:text-primary-200 ${
          location.pathname === '/' ? 'text-primary-200 font-semibold' : ''
        }`}
      >
        Search
      </Link>
      <Link 
        to="/products" 
        className={`hover:text-primary-200 ${
          location.pathname === '/products' ? 'text-primary-200 font-semibold' : ''
        }`}
      >
        Products
      </Link>
    </nav>
  )
}

function Header({ onSearch, onSearchInput, isLoading, onClear, query }: { onSearch: (query: string) => void, onSearchInput: (query: string) => void, isLoading: boolean, onClear: () => void, query: string }) {
  const location = useLocation()
  const isSearchRoute = location.pathname === '/'

  return (
    <header className="w-screen sticky top-0 bg-primary-700 text-white">
      <div className="w-full mx-auto px-4">
        <div className="w-full py-2">
          <NavLinks />
          <div className="flex items-center justify-center p-2">
            <h1 className="text-2xl font-bold mr-4">Smart Product Assistant</h1>
          </div>
          {isSearchRoute && (
            <div className="w-full">
              <SearchBar 
                onSearch={onSearch} 
                onSearchInput={onSearchInput}
                isLoading={isLoading} 
                onClear={onClear}
                query={query}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const handleSearchInput = (query: string) => {
    setSearchInput(query)
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setProducts([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await searchProducts(query)
      setProducts(response.products)
      if (response.products.length === 0) {
        setError('No products found matching your criteria')
      }
    } catch (err) {
      setError('Failed to search products. Please try again.')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchQuery('')
    setProducts([])
    setError(null)
  }

  return (
    <Router>
      <div className="w-full min-h-screen bg-background">
        <div className="w-full relative">
          <Header 
            onSearch={handleSearch} 
            onSearchInput={handleSearchInput}
            isLoading={isLoading}
            onClear={handleClearSearch}
            query={searchInput}
          />
          <Routes>
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/" element={
              <main className="w-full mx-auto px-4 py-6">
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
                      {products.length} products found
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
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-gray-600 mb-4">Start searching for products or</p>
                    <Link 
                      to="/products" 
                      className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      View All Products
                    </Link>
                  </div>
                )}

                {selectedProduct && (
                  <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                  />
                )}
              </main>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
