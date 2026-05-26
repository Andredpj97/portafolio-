import { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import ProductFilters from '../components/ProductFilters';

/**
 * Componente WelcomeSection - Sección de bienvenida y productos destacados.
 * Incluye filtros y la lista de productos.
 */
const WelcomeSection = ({ products, selectedCategory, filtersActive, onClearCategory, onClearFilters }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setFilteredProducts(products);
    setCurrentPage(1);
  }, [products]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
  const maxVisiblePages = 5;
  const halfWindow = Math.floor(maxVisiblePages / 2);
  const windowStart = Math.max(1, Math.min(currentPage - halfWindow, totalPages - maxVisiblePages + 1));
  const windowEnd = Math.min(totalPages, windowStart + maxVisiblePages - 1);
  const visiblePages = Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i);

  return (
    <main id="products-section" className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido a Mi Farmacia</h1>
        <p className="text-lg text-gray-600 mb-8">Encuentra los productos que necesitas con los filtros disponibles.</p>
        
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          {selectedCategory && (
            <div className="inline-flex items-center bg-green-100 border border-green-500 text-green-700 px-4 py-2 rounded-full">
              <span className="font-semibold">Filtrado por: {selectedCategory}</span>
              <button
                onClick={onClearCategory}
                className="ml-2 font-bold hover:text-green-900"
              >
                ✕ Limpiar
              </button>
            </div>
          )}
          {filtersActive && !selectedCategory && (
            <div className="inline-flex items-center bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-full">
              <span className="font-semibold">Filtros activos</span>
              <button
                onClick={onClearFilters}
                className="ml-2 font-bold hover:text-yellow-900"
              >
                ✕ Limpiar todo
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-6">
        <h2 className="text-2xl font-semibold mb-4">Productos ({filteredProducts.length})</h2>
        <ProductList products={paginatedProducts} />

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-6 h-12 rounded-full border text-lg font-semibold transition ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
              }`}
            >
              Anterior
            </button>
            {visiblePages.map((page) => {
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 rounded-full border transition text-lg font-semibold ${
                    isActive
                      ? 'bg-green-700 text-white border-green-700'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}

            {windowEnd < totalPages && (
              <span className="px-2 text-lg text-gray-500 select-none">...</span>
            )}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-6 h-12 rounded-full border text-lg font-semibold transition ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default WelcomeSection;