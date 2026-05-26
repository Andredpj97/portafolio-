import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'

const CartPage = lazy(() => import('../pages/CartPage'))
const OrderHistory = lazy(() => import('../pages/OrderHistory'))
const ProductDetail = lazy(() => import('../pages/ProductDetail'))
const ProductsPage = lazy(() => import('../pages/ProductsPage'))
const HomePage = lazy(() => import('../pages/HomePage'))

const ProductDetailRoute = ({ products }) => {
  const { id } = useParams()
  const productId = parseInt(id, 10)
  const product = products.find((item) => item.id === productId)
  const relatedProducts = product
    ? products.filter((item) => item.category === product.category && item.id !== productId).slice(0, 4)
    : []

  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}

const AppRoutes = ({
  user,
  products,
  filteredProducts,
  selectedCategory,
  headerFilter,
  searchTerm,
  handleFilterByCategory,
  handleHeaderFilterChange,
  handleClearFilters,
  handlePageSearchTermChange,
  handleNavigateToProducts,
  handleNavigateToSection,
  productsLoading,
  productsError,
}) => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Cargando...</div>}>
      <Routes>
    <Route
      path="/"
      element={(
        <HomePage
          products={products}
          onNavigateToProducts={handleNavigateToProducts}
          onNavigateToSection={handleNavigateToSection}
          onCategorySelect={(category) => {
            handleFilterByCategory(category)
            handleNavigateToProducts()
          }}
        />
      )}
    />
    <Route
      path="/productos"
      element={(
        <ProductsPage
          products={filteredProducts}
          allProducts={products}
          selectedCategory={selectedCategory}
          headerFilter={headerFilter}
          searchTerm={searchTerm}
          onSelectCategory={handleFilterByCategory}
          onFilterChange={handleHeaderFilterChange}
          onClearFilters={handleClearFilters}
          onSearchTermChange={handlePageSearchTermChange}
          loading={productsLoading}
          error={productsError}
        />
      )}
    />
    <Route path="/carrito" element={user ? <CartPage /> : <Navigate to="/" replace />} />
    <Route path="/ordenes" element={user ? <OrderHistory /> : <Navigate to="/" replace />} />
    <Route path="/producto/:id" element={<ProductDetailRoute products={products} />} />
    <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
