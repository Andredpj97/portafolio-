import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';

const slides = [
  {
    id: 1,
    tag: 'Entrega en 24h',
    title: 'Tu salud, sin esperas.',
    description: 'Medicamentos y cuidado diario con entregas rapidas y asesoramiento confiable.',
    cta: 'Ver productos',
    accent: 'from-emerald-500 to-lime-400',
    bg: 'from-emerald-50 via-white to-blue-50'
  },
  {
    id: 2,
    tag: 'Ofertas de temporada',
    title: 'Ahorra en lo esencial.',
    description: 'Promos semanales en vitaminas, higiene y cuidado personal.',
    cta: 'Descubrir ofertas',
    accent: 'from-blue-500 to-cyan-400',
    bg: 'from-blue-50 via-white to-emerald-50'
  },
  {
    id: 3,
    tag: 'Cuidado integral',
    title: 'Bienestar que se siente.',
    description: 'Suplementos y productos confiables para cada etapa del dia.',
    cta: 'Explorar bienestar',
    accent: 'from-amber-500 to-orange-400',
    bg: 'from-amber-50 via-white to-emerald-50'
  }
];

const HomeCarousel = ({ onPrimaryAction, onNavigateToSection }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }
    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${activeSlide.bg}`} />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center brand-font">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.36, ease: 'easeOut' }}
            >
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${activeSlide.accent}`}>
                {activeSlide.tag}
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {activeSlide.title}
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                {activeSlide.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  className="px-6 py-3 rounded-full bg-green-700 text-white font-semibold shadow-sm hover:bg-green-800 hover:scale-[1.02] transition"
                >
                  {activeSlide.cta}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToSection?.('categories-section')}
                  className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-white/70 hover:scale-[1.02] transition"
                >
                  Ver categorias
                </button>
              </div>

              <div className="mt-8 flex items-center gap-3">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Ir a slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex ? 'w-10 bg-green-700' : 'w-4 bg-green-200'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute -top-6 -right-6 h-28 w-28 rounded-3xl bg-white/70 shadow-lg" />
            <div className="absolute bottom-6 -left-8 h-20 w-20 rounded-2xl bg-white/60 shadow-md" />
            <div className="relative bg-white/85 backdrop-blur rounded-3xl border border-white/60 shadow-2xl p-6">
              <div className="flex items-center justify-between">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${activeSlide.accent}`} />
                <span className="text-xs text-gray-500">Respaldo farmacologico</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div className="text-xs text-emerald-700">Disponibles</div>
                  <div className="text-2xl font-semibold text-emerald-900">+350</div>
                  <div className="text-xs text-emerald-700">productos</div>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="text-xs text-blue-700">Atencion</div>
                  <div className="text-2xl font-semibold text-blue-900">24/7</div>
                  <div className="text-xs text-blue-700">consulta rapida</div>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
                <div className="text-xs text-gray-500">Tu orden esta en camino</div>
                <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-green-500 to-lime-400" />
                </div>
                <div className="mt-2 text-xs text-gray-400">Actualizado hace 5 min</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeCarousel;

HomeCarousel.propTypes = {
  onPrimaryAction: PropTypes.func,
  onNavigateToSection: PropTypes.func,
};
