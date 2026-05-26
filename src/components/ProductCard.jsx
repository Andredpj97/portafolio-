import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import CartContext from '../context/CartContext';
import getProductImage from '../utils/productImages';
import { useUi } from '../context/UiContext';
import { PREMIUM_CARD_HOVER, PREMIUM_HOVER_TRANSITION } from '../utils/animationTokens';

/**
 * Componente ProductCard - Tarjeta de producto individual.
 * Muestra información del producto y permite agregarlo al carrito.
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { showToast } = useUi();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const price = parseFloat(product.price);
  const discount = price >= 15 ? 20 : price >= 10 ? 10 : null;
  const originalPrice = discount ? price / (1 - discount / 100) : null;

  const handleAddToCart = () => {
    const added = addToCart(product);
    if (added) {
      showToast({
        message: `${product.name} agregado al carrito`,
        variant: 'success',
      });
    } else {
      showToast({
        message: `Límite de unidades para ${product.name}`,
        variant: 'error',
      });
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden flex flex-col cursor-pointer"
      layout
      initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={prefersReducedMotion
        ? undefined
        : {
            ...PREMIUM_CARD_HOVER,
            transition: PREMIUM_HOVER_TRANSITION,
          }}
      transition={prefersReducedMotion
        ? { duration: 0 }
        : {
            opacity: { duration: 0.26, ease: 'easeOut' },
            y: { duration: 0.34, ease: 'easeOut' },
            scale: { duration: 0.3, ease: 'easeOut' },
            layout: { duration: 0.3, ease: 'easeOut' },
          }}
      onClick={() => navigate(`/producto/${product.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/producto/${product.id}`);
        }
      }}
    >
      <div className="bg-gray-50 p-4 flex items-center justify-center h-52 relative">
        {discount && (
          <div className="absolute top-3 right-3">
            <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
              OFERTA {discount}%
            </div>
          </div>
        )}
        <LazyLoadImage
          src={getProductImage(product)}
          alt={product.name}
          effect="blur"
          className="h-36 object-contain cursor-pointer hover:opacity-80 transition"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs uppercase tracking-wide text-gray-700 mb-2">{product.brand}</span>
        <Link
          to={`/producto/${product.id}`}
          aria-label={`Ver detalles de ${product.name}`}
          className="text-lg font-semibold text-green-700 hover:text-green-800 transition mb-3 line-clamp-2"
        >
          {product.name}
        </Link>
        <div className="mt-auto">
          {discount ? (
            <div className="mb-4">
              <div className="text-sm text-gray-400 line-through">S/ {originalPrice.toFixed(2)}</div>
              <div className="text-xl font-bold text-green-700">S/ {price.toFixed(2)} <span className="text-xs text-green-700">Ahora</span></div>
            </div>
          ) : (
            <div className="text-xl font-bold text-green-700 mb-4">S/ {price.toFixed(2)}</div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            aria-label={`Agregar ${product.name} al carrito`}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            Agregar
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default React.memo(ProductCard)

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.string,
  }).isRequired,
}
