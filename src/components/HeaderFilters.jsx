import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Componente HeaderFilters - Filtros compactos para el header
 * Proporciona opciones rápidas de filtrado por precio y marca
 */
const HeaderFilters = ({ products, onFilterChange, resetKey }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, 100]);
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [draftPriceRange, setDraftPriceRange] = useState([0, 100]);
  const [draftBrands, setDraftBrands] = useState([]);

  const brands = [...new Set(products.map(p => p.brand))];
  const maxPrice = Math.max(...products.map(p => parseFloat(p.price)), 100);

  const handleToggleFilters = () => {
    if (!showFilters) {
      setDraftPriceRange(appliedPriceRange);
      setDraftBrands(appliedBrands);
    }
    setShowFilters(!showFilters);
  };

  const handleCloseFilters = () => {
    setDraftPriceRange(appliedPriceRange);
    setDraftBrands(appliedBrands);
    applyFilters(appliedPriceRange[0], appliedPriceRange[1], appliedBrands);
    setShowFilters(false);
  };

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value);
    const newRange = [draftPriceRange[0], newPrice];
    setDraftPriceRange(newRange);
    applyFilters(newRange[0], newRange[1], draftBrands);
  };

  const handleBrandToggle = (brand) => {
    const newBrands = draftBrands.includes(brand)
      ? draftBrands.filter(b => b !== brand)
      : [...draftBrands, brand];
    setDraftBrands(newBrands);
    applyFilters(draftPriceRange[0], draftPriceRange[1], newBrands);
  };

  const applyFilters = (minPrice, maxPrice, brands) => {
    if (typeof onFilterChange !== 'function') {
      return;
    }
    onFilterChange({ priceRange: [minPrice, maxPrice], brands });
  };

  useEffect(() => {
    setAppliedPriceRange([0, maxPrice]);
    setAppliedBrands([]);
    setDraftPriceRange([0, maxPrice]);
    setDraftBrands([]);
    setShowFilters(false);
    applyFilters(0, maxPrice, []);
  }, [resetKey, maxPrice]);

  const handleApply = () => {
    setAppliedPriceRange(draftPriceRange);
    setAppliedBrands(draftBrands);
    applyFilters(draftPriceRange[0], draftPriceRange[1], draftBrands);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setDraftPriceRange([0, maxPrice]);
    setDraftBrands([]);
  };

  const hasFilters = appliedPriceRange[1] !== maxPrice || appliedBrands.length > 0;

  return (
    <div className="relative">
      <button
        onClick={handleToggleFilters}
        aria-haspopup="dialog"
        aria-expanded={showFilters}
        aria-controls="header-filters"
        className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all ${
          hasFilters
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        <span>🔽</span>
        <span>Filtrar</span>
        {hasFilters && <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">!</span>}
      </button>

      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={handleCloseFilters}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-40"
              id="header-filters"
              role="dialog"
            >
              <div className="space-y-4">
                {/* Filtro de Precio */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">Rango de Precio</h3>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={draftPriceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>S/ 0</span>
                    <span>S/ {draftPriceRange[1].toFixed(2)}</span>
                  </div>
                </div>

                {/* Filtro de Marcas */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">Marcas</h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={draftBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="w-3 h-3 text-green-600 rounded"
                        />
                        <span className="text-xs text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={handleCloseFilters}
                    className="flex-1 px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                  >
                    Cancelar
                  </button>
                  {hasFilters && (
                    <button
                      onClick={resetFilters}
                      className="flex-1 px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                    >
                      Limpiar
                    </button>
                  )}
                  <button
                    onClick={handleApply}
                    className="flex-1 px-3 py-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded transition"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderFilters;
