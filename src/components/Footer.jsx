/**
 * Componente Footer - Pie de página con información de la tienda.
 * Incluye enlaces, contacto y derechos de autor.
 */
const Footer = () => {
  return (
    <footer id="contact-section" className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Mi Farmacia</h3>
            <p>Tu tienda en línea de confianza para productos de salud y bienestar.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces</h3>
            <ul>
              <li><a href="#" className="hover:text-green-400">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-green-400">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-green-400">Términos de Servicio</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <p>Email: info@mifarmacia.com</p>
            <p>Teléfono: +51 123 456 789</p>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-gray-700 pt-4">
          <p>&copy; 2026 Mi Farmacia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;