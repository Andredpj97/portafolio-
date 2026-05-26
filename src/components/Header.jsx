import logo from '../assets/logo minimalista farmacia.png'
import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'
import LoginModal from './LoginModal';
import SearchBar from './SearchBar';
import CartContext from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Header para la tienda de farmacia.
 * Incluye logo, navegación, buscador y botones de usuario.
 */
const Header = ({ products, onSearchTermChange, onSearchSubmit, onSearchDropdownOpenChange, onFilterByCategory, onNavigateToSection, onNavigateToProducts, searchTerm, onBrandSelect, onCategorySelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useContext(CartContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef(null);
  const categoriesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setShowCategoriesMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Definir enlaces de navegación para mejor mantenibilidad
  const navLinks = [
    {
      label: 'Productos',
      action: () => {
        if (onNavigateToProducts) {
          onNavigateToProducts()
        } else if (onNavigateToSection) {
          onNavigateToSection('products-section')
        } else {
          document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    {
      label: 'Contacto',
      action: () => {
        if (onNavigateToSection) {
          onNavigateToSection('contact-section')
        } else {
          document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
  ]

  const categories = [
    { name: 'Medicamentos', icon: '💊' },
    { name: 'Cuidado Personal', icon: '🧴' },
    { name: 'Suplementos', icon: '💪' },
    { name: 'Higiene', icon: '🧼' },
  ];

  const getTypesForCategory = (categoryName) => {
    const productsInCategory = products.filter(p => p.category === categoryName);
    const typesSet = new Set(productsInCategory.map(p => p.type));
    return Array.from(typesSet).sort();
  };

  const handleCategoriesBlur = (event) => {
    if (categoriesRef.current && !categoriesRef.current.contains(event.relatedTarget)) {
      setShowCategoriesMenu(false)
    }
  }

  const handleNavClick = (action) => {
    action()
    setIsMobileMenuOpen(false)
  }

  const photoUrl = user?.photoURL || user?.providerData?.[0]?.photoURL || ''
  const showAvatar = Boolean(photoUrl) && !avatarError

  return (
    <header className="sticky top-0 bg-white shadow-lg border-b border-gray-200 z-40">
      <div className={`container mx-auto flex ${isMobileMenuOpen ? 'flex-wrap' : 'flex-nowrap'} lg:flex-nowrap justify-between items-center gap-2 md:gap-4 py-3 md:py-4 px-4`}>
        {/* Logo de la farmacia */}
        <button
          onClick={() => {
            if (onNavigateToSection) {
              onNavigateToSection('top')
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          aria-label="Ir al inicio"
          className="h-12 md:h-16 lg:h-20 hover:opacity-80 transition-opacity duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          <img
            src={logo}
            alt="Logo Mi Farmacia"
            className="h-12 md:h-16 lg:h-20 w-auto"
          />
        </button>

        {/* Navegación principal */}
        <nav
          aria-label="Navegacion principal"
          className={`order-3 w-full lg:order-none lg:w-auto ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}
        >
          <ul className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-20">
            {navLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavClick(link.action)}
                  className="w-full text-left lg:text-center px-2 py-2 lg:px-0 lg:py-0 rounded-lg lg:rounded-none hover:bg-green-50 lg:hover:bg-transparent text-green-800 text-sm md:text-base lg:text-xl font-semibold transform md:hover:scale-110 transition-all duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-green-600 after:left-2 lg:after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-[calc(100%-1rem)] lg:hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                >
                  {link.label}
                </button>
              </li>
            ))}
            
            {/* Categorías en la navegación */}
            <li 
              className="relative"
              ref={categoriesRef}
              onMouseEnter={() => setShowCategoriesMenu(true)}
              onMouseLeave={() => setShowCategoriesMenu(false)}
              onFocus={() => setShowCategoriesMenu(true)}
              onBlur={handleCategoriesBlur}
            >
              <button
                aria-haspopup="menu"
                aria-expanded={showCategoriesMenu}
                aria-controls="categories-menu"
                onClick={() => setShowCategoriesMenu((prev) => !prev)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setShowCategoriesMenu(false)
                  }
                }}
                className="w-full text-left lg:text-center px-2 py-2 lg:px-0 lg:py-0 rounded-lg lg:rounded-none hover:bg-green-50 lg:hover:bg-transparent text-green-800 text-sm md:text-base lg:text-xl font-semibold transform md:hover:scale-110 transition-all duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-green-600 after:left-2 lg:after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-[calc(100%-1rem)] lg:hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                Categorías
              </button>
              <AnimatePresence>
                {showCategoriesMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 w-full lg:w-56 bg-white border border-green-200 rounded-lg shadow-xl p-2 z-50 lg:absolute lg:left-0 lg:md:left-1/2 lg:md:-translate-x-1/2"
                    id="categories-menu"
                    role="menu"
                  >
                    {categories.map((category, index) => {
                      const categoryTypes = getTypesForCategory(category.name);
                      return (
                        <div
                          key={index}
                          className="relative"
                          onMouseEnter={() => setHoveredCategory(category.name)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <motion.button
                            role="menuitem"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={() => {
                              setShowCategoriesMenu(false);
                              setIsMobileMenuOpen(false);
                              if (onFilterByCategory) {
                                onFilterByCategory(category.name);
                                if (onNavigateToProducts) {
                                  onNavigateToProducts()
                                }
                              }
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded text-gray-800 flex items-center justify-between transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 group/category"
                          >
                            <span className="flex items-center space-x-3">
                              <span className="text-xl transition-transform duration-200 group-hover/category:scale-110">{category.icon}</span>
                              <span className="font-semibold text-gray-900">{category.name}</span>
                            </span>
                            {categoryTypes.length > 0 && (
                              <motion.span 
                                animate={{ x: hoveredCategory === category.name ? 5 : 0 }}
                                transition={{ duration: 0.15 }}
                                className="text-lg text-green-600 font-bold"
                              >
                                →
                              </motion.span>
                            )}
                          </motion.button>

                          {/* Área invisible que mantiene el hover hacia el submenu */}
                          {categoryTypes.length > 0 && hoveredCategory === category.name && (
                            <div className="absolute left-full top-0 w-2 h-full" />
                          )}

                          {categoryTypes.length > 0 && hoveredCategory === category.name && (
                            <motion.div
                              initial={{ opacity: 0, x: -15, scale: 0.95 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -15, scale: 0.95 }}
                              transition={{ duration: 0.12, ease: "easeOut" }}
                              className="absolute left-full top-0 ml-2 bg-gradient-to-b from-white to-green-50 border-2 border-green-200 rounded-xl shadow-2xl p-3 min-w-[160px] z-50"
                              onMouseEnter={() => setHoveredCategory(category.name)}
                              onMouseLeave={() => setHoveredCategory(null)}
                            >
                              <div className="space-y-1">
                                {categoryTypes.map((type, typeIndex) => (
                                  <motion.button
                                    key={typeIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: typeIndex * 0.02, duration: 0.12 }}
                                    whileHover={{ x: 5 }}
                                    onClick={() => {
                                      setShowCategoriesMenu(false);
                                      setIsMobileMenuOpen(false);
                                      if (onFilterByCategory) {
                                        onFilterByCategory(category.name, type);
                                        if (onNavigateToProducts) {
                                          onNavigateToProducts()
                                        }
                                      }
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-green-200 rounded-lg text-gray-800 text-sm transition-all duration-150 font-medium flex items-center space-x-2 group/type"
                                  >
                                    <motion.span 
                                      className="text-green-600 text-lg"
                                      animate={{ scale: 1 }}
                                      whileHover={{ scale: 1.2, rotate: 10 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      ✓
                                    </motion.span>
                                    <span className="group-hover/type:text-green-700 transition-colors duration-150">{type}</span>
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </nav>

        {/* Buscador y acciones de usuario */}
        <div className="order-2 lg:order-none flex-1 lg:flex-none min-w-0 flex items-center justify-end gap-2 md:gap-4">
          <div className="flex-1 min-w-0 max-w-[210px] sm:max-w-[280px] md:max-w-[360px] lg:max-w-none lg:flex-none flex items-center gap-3">
            <SearchBar
              products={products}
              onSearchTermChange={onSearchTermChange}
              onSearchSubmit={onSearchSubmit}
              onDropdownOpenChange={onSearchDropdownOpenChange}
              onBrandSelect={onBrandSelect}
              onCategorySelect={onCategorySelect}
              searchTerm={searchTerm}
              enableDropdown
            />
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-green-200 text-green-800 hover:bg-green-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            <span aria-hidden="true" className="text-xl leading-none">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>

          {/* Botón del Carrito */}
          {user ? (
            <Link
              to="/carrito"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Ir al carrito"
              className="relative text-green-800 hover:text-green-600 md:hover:scale-125 transition-all duration-200 text-xl md:text-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              🛒
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label="Ir al carrito"
              className="relative text-green-800 hover:text-green-600 md:hover:scale-125 transition-all duration-200 text-xl md:text-2xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              title="Inicia sesión para acceder al carrito"
            >
              🛒
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          )}


          {/* Menú de usuario */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu((s) => !s)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowUserMenu((s) => !s);
                  }
                }}
                aria-haspopup="menu"
                aria-expanded={showUserMenu}
                className="flex items-center hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                {showAvatar ? (
                  <img
                    src={photoUrl}
                    alt={user.displayName}
                    className="h-10 w-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </button>

              {showUserMenu && (
                <div role="menu" className="absolute right-0 mt-3 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">
                  <div className="flex flex-col items-center text-center mb-3">
                    {showAvatar && (
                      <img
                        src={photoUrl}
                        alt={user.displayName}
                        className="h-12 w-12 rounded-full object-cover mb-2"
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                      />
                    )}
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{user.displayName}</div>
                      <div className="text-xs text-gray-500 break-words max-w-[12rem]">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/ordenes"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-3 py-2 rounded bg-green-50 text-green-600 hover:bg-green-100 transition mb-2 block text-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  >
                    Mis Órdenes
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label="Iniciar sesion"
              className="text-green-800 hover:text-green-600 md:hover:scale-125 transition-all duration-200 text-xl md:text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              👤
            </button>
          )}
        </div>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  )
}

export default React.memo(Header)

Header.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.string,
  })).isRequired,
  onSearchTermChange: PropTypes.func,
  onSearchSubmit: PropTypes.func,
  onSearchDropdownOpenChange: PropTypes.func,
  onBrandSelect: PropTypes.func,
  onCategorySelect: PropTypes.func,
  onFilterByCategory: PropTypes.func,
  onNavigateToSection: PropTypes.func,
  onNavigateToProducts: PropTypes.func,
  searchTerm: PropTypes.string,
}