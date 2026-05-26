import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import getProductImage from '../utils/productImages';

const TopSellersSection = ({ products, onNavigateToProducts }) => {
  const topProducts = products.slice(0, 6);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-16 bg-gradient-to-br from-white via-emerald-50/40 to-slate-100 brand-font">
      <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950">Top ventas de la semana</h2>
            <p className="text-emerald-900/70 mt-2">Los productos favoritos de nuestros clientes.</p>
          </div>
          <button
            type="button"
            onClick={onNavigateToProducts}
            className="px-6 py-2 rounded-full border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
          >
            Ver todo
          </button>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topProducts.map((product, index) => (
            <motion.article
              key={product.id}
              className="group overflow-hidden rounded-3xl bg-white/90 shadow-lg ring-1 ring-emerald-100/60 transition hover:-translate-y-1 hover:shadow-2xl"
              layout
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={prefersReducedMotion
                ? { duration: 0 }
                : {
                    opacity: { duration: 0.26, delay: Math.min(index * 0.045, 0.27), ease: 'easeOut' },
                    y: { duration: 0.34, delay: Math.min(index * 0.045, 0.27), ease: 'easeOut' },
                    scale: { duration: 0.3, delay: Math.min(index * 0.045, 0.27), ease: 'easeOut' },
                    layout: { duration: 0.3, ease: 'easeOut' },
                  }}
            >
              <Link to={`/producto/${product.id}`} className="block">
                <div className="relative h-48 sm:h-56">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                </div>
                <div className="bg-emerald-50/80 px-5 py-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-400/80">{product.brand}</div>
                  <h3 className="text-lg font-semibold text-emerald-900">{product.name}</h3>
                  <p className="text-sm text-emerald-900/60 mt-1">Favorito de la semana</p>
                </div>
              </Link>
              <div className="px-5 pb-5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-green-700">S/ {parseFloat(product.price).toFixed(2)}</span>
                  <span className="text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
                    Ver detalle →
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopSellersSection;

TopSellersSection.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.string,
  })).isRequired,
  onNavigateToProducts: PropTypes.func,
};
