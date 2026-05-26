/**
 * Componente HeroSection - Sección principal de bienvenida con llamada a la acción.
 * Incluye un banner con gradiente, título y botón para explorar productos.
 */
const HeroSection = () => {
  const handleExploreClick = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Tu Salud, Nuestra Prioridad</h1>
        <p className="text-xl mb-8">Encuentra medicamentos, suplementos y productos de cuidado personal de calidad.</p>
        <button 
          onClick={handleExploreClick}
          className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Explorar Productos
        </button>
      </div>
    </section>
  );
};

export default HeroSection;