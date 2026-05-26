import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Componente CategoriesSection - Muestra las categorías principales de productos.
 * Incluye tarjetas para Medicamentos, Cuidado Personal y Suplementos.
 */
const CategoriesSection = ({ onCategorySelect }) => {
  const prefersReducedMotion = useReducedMotion();
  const categories = [
    {
      title: 'Medicamentos',
      description: 'Analgésicos, antibióticos y más.',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    {
      title: 'Cuidado Personal',
      description: 'Higiene, cosméticos y bienestar.',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    {
      title: 'Suplementos',
      description: 'Vitaminas, minerales y nutrición.',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
    {
      title: 'Higiene',
      description: 'Cuidado diario e higiene personal.',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
  ];

  return (
    <section id="categories-section" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Categorías</h2>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.button
              key={index}
              type="button"
              onClick={() => onCategorySelect?.(category.title)}
              layout
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={prefersReducedMotion
                ? { duration: 0 }
                : {
                    opacity: { duration: 0.26, delay: Math.min(index * 0.045, 0.22), ease: 'easeOut' },
                    y: { duration: 0.34, delay: Math.min(index * 0.045, 0.22), ease: 'easeOut' },
                    scale: { duration: 0.3, delay: Math.min(index * 0.045, 0.22), ease: 'easeOut' },
                    layout: { duration: 0.3, ease: 'easeOut' },
                  }}
              className={`${category.bgColor} p-6 rounded-lg text-center hover:shadow-lg transition w-full focus:outline-none focus:ring-2 focus:ring-green-400`}
            >
              <h3 className={`text-xl font-semibold ${category.textColor} mb-2`}>{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;

CategoriesSection.propTypes = {
  onCategorySelect: PropTypes.func,
};