import PropTypes from 'prop-types';

const HomeCta = ({ onNavigateToProducts, onNavigateToSection }) => {
  return (
    <section className="py-14 bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white brand-font">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold">Listo para cuidar tu salud?</h2>
            <p className="mt-2 text-white/90">Explora todo el catalogo y encuentra lo que necesitas hoy.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onNavigateToProducts}
              className="px-6 py-3 rounded-full bg-white text-green-700 font-semibold hover:bg-gray-100 transition"
            >
              Ir a productos
            </button>
            <button
              type="button"
              onClick={() => onNavigateToSection?.('contact-section')}
              className="px-6 py-3 rounded-full border border-white/60 text-white font-semibold hover:bg-white/10 transition"
            >
              Hablar con nosotros
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCta;

HomeCta.propTypes = {
  onNavigateToProducts: PropTypes.func,
  onNavigateToSection: PropTypes.func,
};
