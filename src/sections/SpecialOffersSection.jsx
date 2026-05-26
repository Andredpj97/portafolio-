import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';
import CartContext from '../context/CartContext';
import getProductImage from '../utils/productImages';
import { Link } from 'react-router-dom';
import { useUi } from '../context/UiContext';
import { PREMIUM_CARD_HOVER, PREMIUM_HOVER_TRANSITION, PREMIUM_EASE } from '../utils/animationTokens';

/**
 * Componente SpecialOffersSection - Muestra ofertas especiales de productos.
 * Recibe una lista de productos como props y muestra los primeros 3 con descuento.
 */
const SpecialOffersSection = ({ products }) => {
  const { addToCart } = useContext(CartContext);
  const { showToast } = useUi();
  const prefersReducedMotion = useReducedMotion();
  const railRef = useRef(null);

  const offers = products.slice(0, 10);

  const getDiscount = (price) => {
    if (price >= 20) return 30;
    if (price >= 15) return 25;
    if (price >= 12) return 20;
    if (price >= 10) return 15;
    return 10;
  };

  const handleAddToCart = (product) => {
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

  const [isPaused, setIsPaused] = useState(false);

  const handleScroll = (direction) => {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!railRef.current || isPaused) return undefined;
    const intervalId = setInterval(() => {
      const rail = railRef.current;
      if (!rail) return;
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      if (rail.scrollLeft >= maxScrollLeft - 4) {
        rail.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        rail.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isPaused]);

  return (
    <section className="py-14 bg-slate-50 brand-font">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Ofertas Especiales</h2>
            <p className="text-sm text-slate-600 mt-1">Descuentos destacados para ti.</p>
          </div>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
          >
            Ver mas
            <span aria-hidden="true">+</span>
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => handleScroll(-1)}
            className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-11 w-11 rounded-full bg-white text-slate-600 shadow-lg ring-1 ring-slate-200 hover:bg-slate-100"
            aria-label="Deslizar a la izquierda"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => handleScroll(1)}
            className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-11 w-11 rounded-full bg-white text-slate-600 shadow-lg ring-1 ring-slate-200 hover:bg-slate-100"
            aria-label="Deslizar a la derecha"
          >
            ›
          </button>

          <div
            ref={railRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {offers.map((product) => {
              const price = parseFloat(product.price);
              const discount = getDiscount(price);
              const originalPrice = price / (1 - discount / 100);

              return (
                <Link
                  key={product.id}
                  to={`/producto/${product.id}`}
                  className="snap-start h-full min-w-[240px] sm:min-w-[260px] lg:min-w-[280px]"
                >
                  <motion.article
                    layout
                    whileHover={PREMIUM_CARD_HOVER}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          opacity: { duration: 0.26, ease: PREMIUM_EASE },
                          y: { duration: 0.34, ease: PREMIUM_EASE },
                          scale: { duration: 0.3, ease: PREMIUM_EASE },
                          layout: { duration: 0.3, ease: PREMIUM_EASE },
                        }}
                    className="h-full bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden flex flex-col transition"
                  >
                    <div className="relative h-44 bg-slate-50 flex items-center justify-center">
                      <span className="absolute right-3 top-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white shadow">
                        {discount}%
                      </span>
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="h-24 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-4 py-4 flex flex-col flex-1">
                      <span className="text-xs uppercase tracking-wide text-slate-400">{product.brand}</span>
                      <h3 className="mt-1 min-h-[3.5rem] text-base font-semibold text-slate-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="mt-3">
                        <div className="text-xs text-slate-400 line-through">S/ {originalPrice.toFixed(2)}</div>
                        <div className="text-lg font-bold text-emerald-700">S/ {price.toFixed(2)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="mt-auto w-full rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Agregar
                      </button>
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;

SpecialOffersSection.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.string,
  })).isRequired,
};