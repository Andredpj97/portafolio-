import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import CartContext from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';
import ProductCard from '../components/ProductCard';
import getProductImage from '../utils/productImages';
import { useUi } from '../context/UiContext';
import { Link } from 'react-router-dom';

/**
 * Componente ProductDetail - Página de detalles de un producto.
 * Muestra información completa del producto y permite agregarlo al carrito.
 */
const ProductDetail = ({ product, relatedProducts = [] }) => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [maxReached, setMaxReached] = useState(false);
  const { showToast } = useUi();

  const MAX_QUANTITY = 20;
  const shortDescription = product?.description
    ? `${product.description.split('. ')[0]}${product.description.includes('.') ? '.' : ''}`
    : '';

  const handleAddToCart = () => {
    let addedAll = true;
    for (let i = 0; i < quantity; i++) {
      const added = addToCart(product);
      if (!added) {
        addedAll = false;
        break;
      }
    }
    if (!addedAll) {
      setMaxReached(true);
      setTimeout(() => setMaxReached(false), 2000);
    }
    if (addedAll) {
      showToast({
        message: `${quantity} ${product.name} agregado al carrito`,
        variant: 'success',
      });
    } else {
      showToast({
        message: `Límite de unidades para ${product.name}`,
        variant: 'error',
      });
    }
    setQuantity(1);
  };

  const handleQuantityChange = (value) => {
    if (value > MAX_QUANTITY) {
      setMaxReached(true);
      setTimeout(() => setMaxReached(false), 2000);
      return;
    }
    setQuantity(value);
  };

  if (!product) {
    return (
      <ScrollReveal>
        <main className="container mx-auto p-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
          <Link to="/" className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition">
            Volver a la tienda
          </Link>
        </main>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal>
      <main className="container mx-auto p-4 py-12">
        <Link to="/productos" className="text-green-600 hover:text-green-700 font-semibold mb-6 inline-block">
          ← Volver a la tienda
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
          {/* Imagen del producto */}
          <div className="group relative overflow-hidden flex items-center justify-center bg-gray-100 rounded-lg p-10 min-h-[28rem]">
            <img src={getProductImage(product)} alt={product.name} className="w-full max-w-2xl max-h-[26rem] object-contain transition-transform duration-300 ease-out group-hover:scale-110 cursor-zoom-in" />
          </div>

          {/* Información del producto */}
          <div>
            <div className="mb-4">
              <p className="text-green-600 font-semibold mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.brand}</p>
              {shortDescription && (
                <p className="text-sm text-gray-500 mt-2">{shortDescription}</p>
              )}
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-green-600 mb-2">S/ {parseFloat(product.price).toFixed(2)}</p>
            </div>

            {/* Detalles */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Especificaciones</h3>
              <p className="text-gray-700 text-sm">{product.details}</p>
            </div>

            {/* Beneficios */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Beneficios</h3>
              <ul className="space-y-2">
                {product.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cantidad y carrito */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={MAX_QUANTITY}
                  aria-label="Cantidad"
                  className="w-16 text-center border-l border-r border-gray-300 py-2 focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= MAX_QUANTITY}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
              >
                Agregar al Carrito ({quantity})
              </button>
            </div>

            {maxReached && (
              <div className="p-3 bg-yellow-100 border border-yellow-500 text-yellow-700 rounded mb-4">
                Límite de {MAX_QUANTITY} unidades alcanzado
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-green-600 font-semibold">Recomendado para ti</p>
                <h2 className="text-2xl font-bold text-gray-800">Productos relacionados</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
    </ScrollReveal>
  );
};

export default ProductDetail;

ProductDetail.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    details: PropTypes.string,
    benefits: PropTypes.arrayOf(PropTypes.string),
  }),
  relatedProducts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string,
    price: PropTypes.string,
    image: PropTypes.string,
  })),
};
