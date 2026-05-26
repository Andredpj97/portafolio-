import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { motion, useReducedMotion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { PREMIUM_CARD_HOVER, PREMIUM_HOVER_TRANSITION, PREMIUM_TW_TRANSFORM, PREMIUM_TW_TRANSITION } from '../utils/animationTokens'

/**
 * Componente SearchBar - Buscador de productos.
 * Permite buscar por nombre del producto.
 */
const SearchBar = ({ searchTerm, onSearchTermChange, onSearchSubmit, products = [], variant = 'main', enableDropdown = false, onDropdownOpenChange, onBrandSelect, onCategorySelect }) => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const isCompact = variant === 'compact';
  const shouldShowDropdown = !isCompact && enableDropdown;
  const [isOpen, setIsOpen] = useState(false);
  const isExternallyControlled = typeof searchTerm === 'string';
  const [internalTerm, setInternalTerm] = useState(searchTerm ?? '');
  const containerRef = useRef(null);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: { search: searchTerm ?? '' }
  });
  const inputTerm = isExternallyControlled ? searchTerm : internalTerm;
  const normalizedTerm = inputTerm.trim().toLowerCase();

  useEffect(() => {
    if (isExternallyControlled) {
      setInternalTerm(searchTerm)
    }
  }, [isExternallyControlled, searchTerm])

  const matchedProducts = useMemo(() => {
    if (!normalizedTerm) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(normalizedTerm) ||
      product.brand.toLowerCase().includes(normalizedTerm)
    );
  }, [products, normalizedTerm]);

  const matchedBrands = useMemo(() => {
    return Array.from(new Set(matchedProducts.map(product => product.brand))).slice(0, 5);
  }, [matchedProducts]);

  const matchedCategories = useMemo(() => {
    return Array.from(new Set(matchedProducts.map(product => product.category))).slice(0, 5);
  }, [matchedProducts]);

  const topProducts = useMemo(() => matchedProducts, [matchedProducts]);

  useEffect(() => {
    if (!shouldShowDropdown) return;
    setIsOpen(normalizedTerm.length > 0);
  }, [normalizedTerm, shouldShowDropdown]);

  useEffect(() => {
    if (typeof onDropdownOpenChange === 'function') {
      onDropdownOpenChange(shouldShowDropdown && isOpen)
    }
  }, [isOpen, shouldShowDropdown, onDropdownOpenChange])

  useEffect(() => {
    return () => {
      if (typeof onDropdownOpenChange === 'function') {
        onDropdownOpenChange(false)
      }
    }
  }, [onDropdownOpenChange])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const nextValue = e.target.value
    if (!isExternallyControlled) {
      setInternalTerm(nextValue)
    }
    setValue('search', nextValue, { shouldValidate: false, shouldDirty: true })
    if (typeof onSearchTermChange === 'function') {
      onSearchTermChange(nextValue);
    }
  };

  const handleSearch = () => {
    if (inputTerm.trim().length === 0) return;
    if (shouldShowDropdown) {
      setIsOpen(true);
      return;
    }
    navigate('/productos');
    setIsOpen(false);
  };

  const handleClear = () => {
    if (!isExternallyControlled) {
      setInternalTerm('')
    }
    setValue('search', '')
    if (typeof onSearchTermChange === 'function') {
      onSearchTermChange('');
    }
    setIsOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (shouldShowDropdown) {
        handleGoToResults();
        return;
      }
      handleSearch();
    }
  };

  const onSubmit = (data) => {
    const term = data.search.trim();
    if (term.length === 0) return;
    if (onSearchSubmit) {
      onSearchSubmit(term);
    } else {
      handleSearch();
    }
  };

  const handleGoToResults = () => {
    if (typeof onSearchSubmit === 'function') {
      onSearchSubmit(inputTerm);
    }
    navigate('/productos');
    setIsOpen(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`);
    setIsOpen(false);
  };

  const handleBrandClick = (brand) => {
    if (typeof onBrandSelect === 'function') {
      onBrandSelect(brand, inputTerm);
      setIsOpen(false);
      return;
    }
    const firstBrandMatch = matchedProducts.find((product) => product.brand === brand);
    if (!firstBrandMatch) return;
    handleProductClick(firstBrandMatch.id);
  };

  const handleCategoryClick = (category) => {
    if (typeof onCategorySelect === 'function') {
      onCategorySelect(category, inputTerm);
      setIsOpen(false);
      return;
    }
    handleGoToResults();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        ref={containerRef}
        className={isCompact
          ? "relative w-full max-w-full"
          : "relative w-[200px] sm:w-[280px] md:w-[420px] lg:w-[460px] max-w-full transition-transform duration-200 hover:scale-[1.01] focus-within:scale-[1.01]"
        }
      >
      <input
        type="text"
        placeholder="¿Que estas buscando?"
        {...register('search', {
          required: 'El campo de búsqueda es obligatorio',
          maxLength: { value: 100, message: 'Máximo 100 caracteres' }
        })}
        value={inputTerm}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        aria-label="Buscar productos"
        className={isCompact
          ? "w-full h-9 md:h-10 px-3 md:px-4 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-600 transition-all duration-150 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100"
          : "w-full h-10 md:h-14 px-3 md:px-4 rounded-full border-2 border-gray-300 text-sm md:text-base text-gray-700 transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 hover:shadow-md focus:shadow-lg"
        }
      />
      {errors.search && <p className="text-red-500 text-sm mt-1">{errors.search.message}</p>}
      <button
        type="button"
        onClick={inputTerm.trim().length > 0 ? handleClear : handleSearch}
        className={isCompact
          ? "absolute right-3 top-1/2 -translate-y-1/2 text-base transition-all duration-150 hover:scale-105 flex items-center justify-center w-5 h-5"
          : "absolute right-3 top-1/2 -translate-y-1/2 text-lg md:text-xl transition-all duration-200 hover:scale-110 flex items-center justify-center w-6 h-6 md:w-7 md:h-7"
        }
        aria-label={inputTerm.trim().length > 0 ? "Limpiar búsqueda" : "Buscar"}
      >
        {inputTerm.trim().length > 0 ? '❌' : '🔍'}
      </button>

      {shouldShowDropdown && isOpen && (
        <div className="absolute left-1/2 top-full mt-3 w-[760px] max-w-[94vw] -translate-x-1/2 bg-gray-100/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-300 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-300 bg-gradient-to-r from-gray-200/90 to-gray-100">
            <div className="text-sm text-gray-800">
              Resultados para <span className="font-semibold text-green-700">"{inputTerm}"</span>
            </div>
            <button
              type="button"
              onClick={handleGoToResults}
              className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors duration-150"
            >
              Ver todo →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-4 p-4 md:p-5">
            <aside className="space-y-4">
              <div className="rounded-xl border border-gray-300 bg-gray-200/80 p-3.5">
                <div className="text-sm font-semibold text-green-700 mb-2">Marcas</div>
                <ul className="space-y-1 text-sm text-gray-800">
                  {matchedBrands.length === 0 ? (
                    <li className="text-gray-500">Sin resultados</li>
                  ) : (
                    matchedBrands.map((brand) => (
                      <li key={brand}>
                        <motion.button
                          type="button"
                          onClick={() => handleBrandClick(brand)}
                          whileHover={prefersReducedMotion ? undefined : { x: 3, scale: 1.01 }}
                          transition={prefersReducedMotion ? { duration: 0 } : PREMIUM_HOVER_TRANSITION}
                          className={`w-full truncate text-left rounded-md px-1.5 py-1 hover:bg-gray-300/70 hover:text-green-800 ${PREMIUM_TW_TRANSITION} ${PREMIUM_TW_TRANSFORM}`}
                        >
                          {brand}
                        </motion.button>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-300 bg-gray-200/80 p-3.5">
                <div className="text-sm font-semibold text-green-700 mb-2">Categorías</div>
                <ul className="space-y-1 text-sm text-gray-800">
                  {matchedCategories.length === 0 ? (
                    <li className="text-gray-500">Sin resultados</li>
                  ) : (
                    matchedCategories.map((category) => (
                      <li key={category}>
                        <motion.button
                          type="button"
                          onClick={() => handleCategoryClick(category)}
                          whileHover={prefersReducedMotion ? undefined : { x: 3, scale: 1.01 }}
                          transition={prefersReducedMotion ? { duration: 0 } : PREMIUM_HOVER_TRANSITION}
                          className={`w-full truncate text-left rounded-md px-1.5 py-1 hover:bg-gray-300/70 hover:text-green-800 ${PREMIUM_TW_TRANSITION} ${PREMIUM_TW_TRANSFORM}`}
                        >
                          {category}
                        </motion.button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </aside>

            <div className="search-results-scroll space-y-3 max-h-[420px] overflow-y-auto pr-1.5">
              {topProducts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-200/60 px-4 py-6 text-sm text-gray-600 text-center">
                  No encontramos productos con ese término.
                </div>
              ) : (
                topProducts.map((product) => (
                  <motion.button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductClick(product.id)}
                    whileHover={prefersReducedMotion ? undefined : PREMIUM_CARD_HOVER}
                    transition={prefersReducedMotion ? { duration: 0 } : PREMIUM_HOVER_TRANSITION}
                    className={`group w-full min-h-[132px] text-left rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 hover:border-gray-400 hover:bg-gray-100 ${PREMIUM_TW_TRANSITION} flex items-center gap-4`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`h-20 w-20 rounded-lg object-cover border border-gray-200 ${PREMIUM_TW_TRANSFORM} group-hover:scale-[1.06]`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm uppercase tracking-wide text-gray-600">{product.brand}</div>
                      <div className={`text-lg leading-6 font-semibold text-green-700 truncate ${PREMIUM_TW_TRANSITION} group-hover:text-green-800`}>{product.name}</div>
                      <div className="text-2xl font-bold text-gray-800">S/ {product.price}</div>
                    </div>
                    <span className={`text-green-700 text-xl ${PREMIUM_TW_TRANSFORM} group-hover:translate-x-1.5`} aria-hidden="true">
                      →
                    </span>
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </form>
  );
};

export default SearchBar;

SearchBar.propTypes = {
  searchTerm: PropTypes.string,
  onSearchTermChange: PropTypes.func,
  onSearchSubmit: PropTypes.func,
  onDropdownOpenChange: PropTypes.func,
  onBrandSelect: PropTypes.func,
  onCategorySelect: PropTypes.func,
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
  })),
  variant: PropTypes.oneOf(['main', 'compact']),
  enableDropdown: PropTypes.bool,
};