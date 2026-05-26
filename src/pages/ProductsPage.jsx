import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import { PREMIUM_EASE, PREMIUM_HOVER_TRANSITION, PREMIUM_TW_TRANSFORM, PREMIUM_TW_TRANSITION } from '../utils/animationTokens';

const ProductsPage = ({ products, allProducts, selectedCategory, headerFilter, searchTerm, onSelectCategory, onFilterChange, onClearFilters, onSearchTermChange, loading, error }) => {
  const [sortOption, setSortOption] = useState('default');
  const [pageSize, setPageSize] = useState('12');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileBarVisible, setIsMobileBarVisible] = useState(true);
  const [activeMobilePanel, setActiveMobilePanel] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [pageSearchTerm, setPageSearchTerm] = useState('');
  const lastScrollYRef = useRef(0);
  const forceMobileBarVisibleRef = useRef(false);
  const catalogProducts = allProducts?.length ? allProducts : products;
  
  // Si hay búsqueda, filtrar el catálogo por el término para mostrar solo marcas/categorías relevantes
  const productsForFilters = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return catalogProducts;
    }
    const term = searchTerm.toLowerCase();
    return catalogProducts.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term)
    );
  }, [catalogProducts, searchTerm]);

  const categories = Array.from(new Set(productsForFilters.map((product) => product.category)));
  const brands = Array.from(new Set(productsForFilters.map((product) => product.brand)));
  const maxPrice = Math.max(...productsForFilters.map((product) => parseFloat(product.price)), 100);
  
  // Obtener tipos disponibles basados en la categoría seleccionada
  const types = useMemo(() => {
    if (!selectedCategory) {
      return Array.from(new Set(productsForFilters.map((product) => product.type)));
    }
    return Array.from(
      new Set(
        productsForFilters
          .filter((product) => product.category === selectedCategory)
          .map((product) => product.type)
      )
    );
  }, [productsForFilters, selectedCategory]);

  // Obtener tipos para una categoría específica (para el hover)
  const getTypesForCategory = (category) => {
    return Array.from(
      new Set(
        productsForFilters
          .filter((product) => product.category === category)
          .map((product) => product.type)
      )
    );
  };
  
  const priceRange = headerFilter?.priceRange ?? [0, maxPrice];
  const selectedBrands = headerFilter?.brands ?? [];
  const selectedType = headerFilter?.type ?? null;

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value);
    onFilterChange({ priceRange: [priceRange[0] ?? 0, newPrice], brands: selectedBrands, type: selectedType });
  };

  const handleBrandToggle = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    onFilterChange({ priceRange, brands: newBrands, type: selectedType });
  };

  const handleTypeToggle = (typeValue) => {
    const newType = selectedType === typeValue ? null : typeValue;
    onFilterChange({ priceRange, brands: selectedBrands, type: newType });
  };

  const handlePageSearchChange = (term) => {
    setPageSearchTerm(term);
    if (typeof onSearchTermChange === 'function') {
      onSearchTermChange(term);
    }
  };

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortOption === 'price-asc') {
      list.sort((a, b) => {
        const priceDiff = parseFloat(a.price) - parseFloat(b.price);
        if (priceDiff !== 0) return priceDiff;
        const nameDiff = a.name.localeCompare(b.name);
        if (nameDiff !== 0) return nameDiff;
        return a.id - b.id;
      });
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => {
        const priceDiff = parseFloat(b.price) - parseFloat(a.price);
        if (priceDiff !== 0) return priceDiff;
        const nameDiff = a.name.localeCompare(b.name);
        if (nameDiff !== 0) return nameDiff;
        return a.id - b.id;
      });
    } else if (sortOption === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [products, sortOption]);

  const pageSizeValue = parseInt(pageSize);
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSizeValue));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSizeValue;
  const displayedProducts = sortedProducts.slice(startIndex, startIndex + pageSizeValue);
  const maxVisiblePages = 5;
  const halfWindow = Math.floor(maxVisiblePages / 2);
  const windowStart = Math.max(1, Math.min(validPage - halfWindow, totalPages - maxVisiblePages + 1));
  const windowEnd = Math.min(totalPages, windowStart + maxVisiblePages - 1);
  const visiblePages = Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i);

  const handlePageChange = (page) => {
    const clampedPage = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(clampedPage);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, pageSize, selectedCategory, headerFilter, searchTerm]);

  // Validar que currentPage no supere totalPages cuando cambian los productos
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    const isMobileViewport = () => window.innerWidth < 1024;
    const hasScrollableContent = () => {
      const doc = document.documentElement;
      const body = document.body;
      const contentHeight = Math.max(
        doc.scrollHeight,
        body?.scrollHeight ?? 0,
        doc.offsetHeight,
        body?.offsetHeight ?? 0,
      );
      return contentHeight - window.innerHeight > 8;
    };

    const syncVisibilityByLayout = () => {
      if (!isMobileViewport()) {
        setIsMobileBarVisible(false);
        setActiveMobilePanel(null);
        forceMobileBarVisibleRef.current = false;
        return;
      }

      // Force visible when 1 or fewer products
      if (sortedProducts.length <= 1) {
        forceMobileBarVisibleRef.current = true;
        setIsMobileBarVisible(true);
        return;
      }

      forceMobileBarVisibleRef.current = false;

      if (!hasScrollableContent()) {
        setIsMobileBarVisible(true);
      }
    };

    const handleScroll = () => {
      if (!isMobileViewport()) return;

      // Always show if ref is set (single product scenario)
      if (forceMobileBarVisibleRef.current) {
        setIsMobileBarVisible(true);
        return;
      }

      if (!hasScrollableContent()) {
        setIsMobileBarVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollYRef.current + 8) {
        setIsMobileBarVisible(true);
      } else if (currentScrollY < lastScrollYRef.current - 8) {
        setIsMobileBarVisible(false);
        setActiveMobilePanel(null);
      }

      lastScrollYRef.current = currentScrollY;
    };

    const handleResize = () => {
      syncVisibilityByLayout();
      lastScrollYRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    syncVisibilityByLayout();
    lastScrollYRef.current = window.scrollY;

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [sortedProducts.length]);

  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    const rafId = requestAnimationFrame(() => {
      const doc = document.documentElement;
      const body = document.body;
      const contentHeight = Math.max(
        doc.scrollHeight,
        body?.scrollHeight ?? 0,
        doc.offsetHeight,
        body?.offsetHeight ?? 0,
      );
      const pageIsScrollable = contentHeight - window.innerHeight > 8;

      if (!pageIsScrollable) {
        setIsMobileBarVisible(true);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [displayedProducts.length, sortedProducts.length, pageSize, selectedCategory, headerFilter]);

  const toggleMobilePanel = (panelName) => {
    setActiveMobilePanel((currentPanel) => (currentPanel === panelName ? null : panelName));
  };

  return (
    <main className="container mx-auto p-4 py-12 pb-28 lg:pb-12">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error al cargar productos: {error}
        </div>
      )}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-green-700">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Productos</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`hidden lg:block w-full lg:w-72 bg-white rounded-2xl shadow p-5 h-fit border border-gray-100 hover:shadow-xl ${PREMIUM_TW_TRANSITION}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800">Filtrar por:</h2>
            <motion.button
              type="button"
              onClick={onClearFilters}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={PREMIUM_HOVER_TRANSITION}
              className={`text-xs font-semibold text-green-700 hover:text-green-800 px-3 py-1 rounded-full border border-green-200 bg-green-50 hover:bg-green-100 hover:shadow-md ${PREMIUM_TW_TRANSITION}`}
            >
              Limpiar
            </motion.button>
          </div>

          <div className="mb-6">
            <div className="text-xs uppercase tracking-wide text-gray-700 mb-2">Filtros seleccionados</div>
            <div className="flex flex-wrap gap-2">
              {!selectedCategory && selectedBrands.length === 0 && priceRange[1] === maxPrice && !selectedType ? (
                <span className="text-xs text-gray-700">Sin filtros activos</span>
              ) : (
                <>
                  {selectedCategory && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {selectedCategory}
                    </span>
                  )}
                  {selectedType && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      {selectedType}
                    </span>
                  )}
                  {selectedBrands.map((brand) => (
                    <span key={brand} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {brand}
                    </span>
                  ))}
                  {priceRange[1] !== maxPrice && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      Hasta S/ {priceRange[1].toFixed(2)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mb-6">
            <details open className="group">
              <summary className={`flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 ${PREMIUM_TW_TRANSITION}`}>
                <span className="flex items-center gap-2">
                  <span className="inline-flex w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  Categorias
                </span>
                <span className={`text-gray-700 group-open:rotate-180 ${PREMIUM_TW_TRANSFORM}`}>▾</span>
              </summary>
              <div className="space-y-2 mt-3">
                <button
                  type="button"
                  onClick={() => onSelectCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded text-sm hover:scale-[1.02] hover:shadow-sm ${PREMIUM_TW_TRANSITION} ${
                    !selectedCategory ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'
                  }`}
                >
                  Todas
                </button>
                {categories.map((category) => {
                  const categoryTypes = getTypesForCategory(category);
                  return (
                    <div 
                      key={category} 
                      className="relative"
                      onMouseEnter={() => setHoveredCategory(category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectCategory(category)}
                        className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium hover:shadow-sm flex items-center justify-between ${PREMIUM_TW_TRANSITION} ${
                          selectedCategory === category 
                            ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 shadow-sm' 
                            : 'hover:bg-green-50 text-gray-800'
                        }`}
                      >
                        <span>{category}</span>
                        {categoryTypes.length > 0 && (
                          <span className={`text-sm ${PREMIUM_TW_TRANSFORM} ${
                            hoveredCategory === category ? 'translate-x-1 text-green-600' : 'text-gray-700'
                          }`}>→</span>
                        )}
                      </button>
                      
                      {/* Área invisible que mantiene el hover hacia el submenu */}
                      {categoryTypes.length > 0 && hoveredCategory === category && (
                        <div className="absolute top-full left-0 h-1 w-full" />
                      )}
                      
                      {categoryTypes.length > 0 && hoveredCategory === category && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-full bg-gradient-to-b from-white to-green-50 border-2 border-green-200 rounded-lg shadow-xl p-2 z-10"
                          onMouseEnter={() => setHoveredCategory(category)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <div className="space-y-1">
                            {categoryTypes.map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectCategory(category);
                                  handleTypeToggle(type);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 ${PREMIUM_TW_TRANSITION} ${
                                  selectedType === type && selectedCategory === category
                                    ? 'bg-green-200 text-green-800 shadow-sm'
                                    : 'text-gray-700 hover:bg-green-100 hover:text-green-800'
                                }`}
                              >
                                <span className="text-green-600">✓</span>
                                <span>{type}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </details>
          </div>

          {selectedCategory && types.length > 0 && (
            <div className="mb-6">
              <details open className="group">
                <summary className={`flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 ${PREMIUM_TW_TRANSITION}`}>
                  <span className="flex items-center gap-2">
                    <span className="inline-flex w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    Tipo
                  </span>
                    <span className={`text-gray-700 group-open:rotate-180 ${PREMIUM_TW_TRANSFORM}`}>▾</span>
                </summary>
                <div className="space-y-2 mt-3">
                  {types.map((typeValue) => (
                    <button
                      key={typeValue}
                      type="button"
                      onClick={() => handleTypeToggle(typeValue)}
                      className={`w-full text-left px-3 py-2 rounded text-sm hover:scale-[1.02] hover:shadow-sm ${PREMIUM_TW_TRANSITION} ${
                        selectedType === typeValue ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      {typeValue}
                    </button>
                  ))}
                </div>
              </details>
            </div>
          )}

          <div className="mb-6">
            <details open className="group">
              <summary className={`flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 ${PREMIUM_TW_TRANSITION}`}>
                <span className="flex items-center gap-2">
                  <span className="inline-flex w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                  Precio
                </span>
                  <span className={`text-gray-700 group-open:rotate-180 ${PREMIUM_TW_TRANSFORM}`}>▾</span>
              </summary>
              <div className="mt-3">
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>S/ 0</span>
                  <span>S/ {priceRange[1].toFixed(2)}</span>
                </div>
              </div>
            </details>
          </div>

          <div>
            <details open className="group">
              <summary className={`flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 ${PREMIUM_TW_TRANSITION}`}>
                <span className="flex items-center gap-2">
                  <span className="inline-flex w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Marca
                </span>
                <span className={`text-gray-700 group-open:rotate-180 ${PREMIUM_TW_TRANSFORM}`}>▾</span>
              </summary>
              <div className="space-y-2 mt-3 max-h-60 overflow-y-auto overflow-x-hidden pr-1">
                {brands.map((brand) => (
                  <label key={brand} className={`flex items-center space-x-2 text-sm text-gray-700 hover:scale-[1.02] hover:shadow-sm hover:bg-gray-50 px-2 py-1 rounded ${PREMIUM_TW_TRANSITION}`}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </details>
          </div>
        </aside>

        <section className="flex-1">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col gap-2">
              {searchTerm ? (
                <>
                  <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
                    Resultados de la búsqueda para <span className="text-green-700">"{searchTerm}"</span>
                  </h1>
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (pageSearchTerm.trim().length > 0) {
                        setPageSearchTerm('');
                        if (typeof onSearchTermChange === 'function') {
                          onSearchTermChange('');
                        }
                        return;
                      }
                      onClearFilters();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-sm font-medium text-green-700 hover:text-green-800 underline transition-all duration-200"
                  >
                    Ver todos los resultados →
                  </motion.button>
                </>
              ) : (
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">Buscar en productos</h1>
              )}
            </div>
            <div className="w-full sm:w-[260px] md:w-[320px] lg:w-[360px] opacity-80 hover:opacity-100 transition-opacity duration-150">
              <SearchBar
                searchTerm={pageSearchTerm}
                onSearchTermChange={handlePageSearchChange}
                variant="compact"
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className={`${searchTerm ? 'text-xl lg:text-2xl' : 'text-3xl'} font-bold text-gray-800`}>
                {searchTerm ? '' : 'Todos los productos'}
              </h1>
              <p className="text-sm text-gray-500">Mostrando {displayedProducts.length} de {sortedProducts.length} resultados</p>
            </div>
            <motion.div
              className="hidden lg:flex w-full lg:w-auto flex-col md:flex-row md:items-center gap-3 bg-white/95 border border-gray-200 rounded-2xl p-3 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: PREMIUM_EASE }}
            >
              <motion.div
                className={`flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl px-3 py-2 bg-gray-50 border border-transparent hover:border-green-100 ${PREMIUM_TW_TRANSITION}`}
                whileHover={{ y: -2, scale: 1.01 }}
                transition={PREMIUM_HOVER_TRANSITION}
              >
                <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold sm:min-w-[64px]">Ordenar</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full sm:w-auto sm:min-w-[230px] min-w-0 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm transition-all duration-300 hover:border-green-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                >
                  <option value="default">Selecciona una opcion...</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name">Nombre</option>
                </select>
              </motion.div>
              <motion.div
                className={`flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl px-3 py-2 bg-gray-50 border border-transparent hover:border-green-100 ${PREMIUM_TW_TRANSITION}`}
                whileHover={{ y: -2, scale: 1.01 }}
                transition={PREMIUM_HOVER_TRANSITION}
              >
                <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold sm:min-w-[64px]">Mostrar</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full sm:w-auto sm:min-w-[230px] min-w-0 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm transition-all duration-300 hover:border-green-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                >
                  <option value="12">12 Productos (Por defecto)</option>
                  <option value="24">24 Productos</option>
                  <option value="36">36 Productos</option>
                </select>
              </motion.div>
            </motion.div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              No hay productos con los filtros actuales.
            </div>
          ) : (
            <>
              <div id="products-section">
                <ProductList products={displayedProducts} loading={loading} />
              </div>
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mt-12">
                  <button
                    onClick={() => handlePageChange(validPage - 1)}
                    disabled={validPage === 1}
                    className={`px-4 md:px-6 h-10 md:h-12 rounded-full border text-base md:text-lg font-semibold transition ${
                      validPage === 1
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                    }`}
                  >
                    Anterior
                  </button>
                  {visiblePages.map((page) => {
                    const isActive = page === validPage;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border transition text-base md:text-lg font-semibold ${
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
                    onClick={() => handlePageChange(validPage + 1)}
                    disabled={validPage === totalPages}
                    className={`px-4 md:px-6 h-10 md:h-12 rounded-full border text-base md:text-lg font-semibold transition ${
                      validPage === totalPages
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <div
        className={`lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1rem)] max-w-sm rounded-2xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur transition-all duration-300 ${
          isMobileBarVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          <button
            type="button"
            onClick={() => toggleMobilePanel('sort')}
            className="flex items-center justify-center gap-2 py-3 text-gray-700"
          >
            <span className="text-green-600">⇅</span>
            <span className="font-medium">Ordenar</span>
          </button>
          <button
            type="button"
            onClick={() => toggleMobilePanel('filter')}
            className="flex items-center justify-center gap-2 py-3 text-gray-700"
          >
            <span className="text-green-600">☰</span>
            <span className="font-medium">Filtrar</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeMobilePanel && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar panel"
              className="lg:hidden fixed inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveMobilePanel(null)}
            />

            <motion.div
              className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1rem)] max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {activeMobilePanel === 'sort' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Orden y vista</h3>
                    <button
                      type="button"
                      onClick={() => setActiveMobilePanel(null)}
                      className="text-sm text-gray-500"
                    >
                      Cerrar
                    </button>
                  </div>

                  <div>
                    <label htmlFor="mobile-sort" className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Ordenar</label>
                    <select
                      id="mobile-sort"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white"
                    >
                      <option value="default">Selecciona una opcion...</option>
                      <option value="price-asc">Precio: menor a mayor</option>
                      <option value="price-desc">Precio: mayor a menor</option>
                      <option value="name">Nombre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mobile-page-size" className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Mostrar</label>
                    <select
                      id="mobile-page-size"
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value)}
                      className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white"
                    >
                      <option value="12">12 Productos (Por defecto)</option>
                      <option value="24">24 Productos</option>
                      <option value="36">36 Productos</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Filtros</h3>
                    <button
                      type="button"
                      onClick={() => {
                        onClearFilters();
                        setActiveMobilePanel(null);
                      }}
                      className="text-xs font-semibold text-green-700"
                    >
                      Limpiar
                    </button>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Categoria</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectCategory(null)}
                        className={`px-3 py-2 rounded-lg text-sm ${!selectedCategory ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
                      >
                        Todas
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => onSelectCategory(category)}
                          className={`px-3 py-2 rounded-lg text-sm ${selectedCategory === category ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Precio máximo</div>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={handlePriceChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="mt-2 text-xs text-gray-600">Hasta S/ {priceRange[1].toFixed(2)}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Marca</div>
                    <div className="max-h-28 overflow-y-auto space-y-2 pr-1">
                      {brands.map((brand) => (
                        <label key={brand} className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="w-4 h-4 text-green-600 rounded"
                          />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProductsPage;

ProductsPage.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.string,
    category: PropTypes.string,
  })).isRequired,
  allProducts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.string,
    category: PropTypes.string,
  })),
  selectedCategory: PropTypes.string,
  searchTerm: PropTypes.string,
  headerFilter: PropTypes.shape({
    priceRange: PropTypes.arrayOf(PropTypes.number),
    brands: PropTypes.arrayOf(PropTypes.string),
  }),
  onSelectCategory: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onSearchTermChange: PropTypes.func,
};
