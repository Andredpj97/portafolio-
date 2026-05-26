import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Componente ProductFilters - Filtros de productos por precio y marca.
 * Permite filtrar la lista de productos según criterios del usuario.
 */
const ProductFilters = ({ products, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showBrands, setShowBrands] = useState(false);

  // Obtener marcas únicas
  const brands = [...new Set(products.map(p => p.brand))];

  // Calcular precio máximo
  const maxPrice = Math.max(...products.map(p => parseFloat(p.price)), 100);

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value);
    setPriceRange([priceRange[0], newPrice]);
    applyFilters(priceRange[0], newPrice, selectedBrands);
  };

  const handleBrandToggle = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    applyFilters(priceRange[0], priceRange[1], newBrands);
  };

  const applyFilters = (minPrice, maxPrice, brands) => {
    const filtered = products.filter(product => {
      const price = parseFloat(product.price);
      const inPriceRange = price >= minPrice && price <= maxPrice;
      const inBrands = brands.length === 0 || brands.includes(product.brand);
      return inPriceRange && inBrands;
    });
    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedBrands([]);
    onFilterChange(products);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Filtros</h2>
        {(priceRange[1] !== maxPrice || selectedBrands.length > 0) && (
          <button
            onClick={resetFilters}
            className="text-sm text-green-600 hover:text-green-700 font-semibold"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Filtro de Precio */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3">Rango de Precio</h3>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>S/ {priceRange[0].toFixed(2)}</span>
              <span>S/ {priceRange[1].toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Filtro de Marcas */}
        <div>
          <button
            onClick={() => setShowBrands(!showBrands)}
            className="w-full flex justify-between items-center font-bold text-gray-800 p-2 hover:bg-gray-100 rounded transition"
          >
            <span>Marcas</span>
            <span className={`transition-transform ${showBrands ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: showBrands ? 'auto' : 0, opacity: showBrands ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 p-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
