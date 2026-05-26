import { useContext, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';
import getProductImage from '../utils/productImages';
import { useUi } from '../context/UiContext';
import mercadoPagoLogo from '../assets/mercadopago.png.png';
import wompiLogo from '../assets/wompi.png';
import stripeLogo from '../assets/stripe.png';

/**
 * Componente CartPage - Página del carrito de compras.
 * Permite ver, modificar cantidades y eliminar productos del carrito.
 */
const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, createOrder, clearCart } = useContext(CartContext);
  const { showToast, showConfirm } = useUi();
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');

  const MAX_QUANTITY = 20;

  const handleCreateOrder = () => {
    const order = createOrder(paymentMethod);
    if (order) {
      showToast({
        message: 'Pedido realizado con exito. Gracias por tu compra.',
        variant: 'success',
        duration: 3200,
      });
    }
  };

  const paymentOptions = useMemo(
    () => [
      {
        id: 'mercadopago',
        label: 'Mercado Pago',
        description: 'Tarjetas y billeteras con alta adopcion local.',
        logo: mercadoPagoLogo,
        badge: 'MP',
      },
      {
        id: 'wompi',
        label: 'Wompi (Bancolombia)',
        description: 'Tarjetas, PSE, Nequi y Daviplata.',
        logo: wompiLogo,
        badge: 'WO',
      },
      {
        id: 'stripe',
        label: 'Stripe',
        description: 'Tarjetas y wallets como Apple Pay/Google Pay.',
        logo: stripeLogo,
        badge: 'ST',
      },
    ],
    []
  );

  const hasItems = cartItems.length > 0;

  return (
    <ScrollReveal>
      {hasItems ? (
        <main className="container mx-auto p-4 pt-10 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Carrito de Compras</h1>
          <button
            onClick={() => {
              showConfirm({
                title: 'Vaciar Carrito',
                message: '¿Deseas eliminar todos los productos del carrito?',
                onConfirm: clearCart,
              });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 bg-red-50 text-red-700 font-semibold shadow-sm hover:bg-red-600 hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          >
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white">
              <span className="text-[10px] font-bold leading-[1] -translate-y-[1px]">x</span>
            </span>
            Vaciar carrito
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1">
            <div className="overflow-y-auto" style={{ maxHeight: '520px' }}>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: '30%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '20%' }} />
                </colgroup>
                <thead className="text-white">
                  <tr>
                    <th className="sticky top-0 z-10 bg-green-600 px-6 py-4 text-center align-middle">Producto</th>
                    <th className="sticky top-0 z-10 bg-green-600 px-6 py-4 text-center align-middle">Precio</th>
                    <th className="sticky top-0 z-10 bg-green-600 px-6 py-4 text-center align-middle">Cantidad</th>
                    <th className="sticky top-0 z-10 bg-green-600 px-6 py-4 text-center align-middle">Subtotal</th>
                    <th className="sticky top-0 z-10 bg-green-600 px-6 py-4 text-center align-middle">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      className="border-b hover:bg-gray-50"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                      transition={{ duration: 0.25, delay: index * 0.03, ease: 'easeOut' }}
                    >
                      <td className="px-6 py-4 text-left align-middle">
                        <div className="flex items-center gap-4 h-full">
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            className="h-14 w-14 object-cover rounded-md border border-gray-200"
                          />
                          <div className="flex flex-col">
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center align-middle">S/ {parseFloat(item.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-center align-middle">
                        <div className="flex items-center justify-center h-full space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`text-white px-2 py-1 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ${item.quantity <= 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 hover:scale-110 hover:shadow-md'}`}
                            title={item.quantity <= 1 ? 'Usa el botón Eliminar' : 'Disminuir cantidad'}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= MAX_QUANTITY}
                            className={`text-white px-2 py-1 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 ${item.quantity >= MAX_QUANTITY ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 hover:scale-110 hover:shadow-md'}`}
                            title={item.quantity >= MAX_QUANTITY ? `Límite de ${MAX_QUANTITY} unidades` : 'Aumentar cantidad'}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center align-middle font-bold">S/ {(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                      <td className="px-6 py-4 text-center align-middle">
                        <button
                          onClick={() => {
                            showConfirm({
                              title: 'Eliminar Producto',
                              message: '¿Estás seguro de que deseas eliminar este producto del carrito?',
                              productName: item.name,
                              onConfirm: () => removeFromCart(item.id),
                            });
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded transition-all duration-200 hover:bg-red-700 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          Eliminar
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-8 w-full md:w-96 self-start mt-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen</h2>
            <p className="mb-2 text-gray-700">Cantidad de Productos: <span className="font-semibold">{getTotalItems()}</span></p>
            <p className="text-xl font-bold text-green-700">Total: <span className="text-2xl">S/ {getTotalPrice().toFixed(2)}</span></p>
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Metodo de pago</h3>
              <div className="space-y-2">
                {paymentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition ${
                      paymentMethod === option.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={option.id}
                      checked={paymentMethod === option.id}
                      onChange={() => setPaymentMethod(option.id)}
                      className="self-center"
                      aria-describedby={`payment-${option.id}`}
                    />
                    <span>
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white overflow-hidden"
                          aria-hidden="true"
                        >
                          {option.logo ? (
                            <img 
                              src={option.logo} 
                              alt={`${option.label} logo`} 
                              className="h-full w-full object-contain p-0.5"
                            />
                          ) : (
                            <span className="text-[11px] font-semibold text-gray-600">
                              {option.badge}
                            </span>
                          )}
                        </span>
                        <span className="block font-semibold text-gray-800">{option.label}</span>
                      </span>
                      <span id={`payment-${option.id}`} className="block text-xs text-gray-500 mt-1">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                El cobro real se configurara en el backend.
              </p>
            </div>
            <button
              onClick={handleCreateOrder}
              className="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:bg-green-700 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Confirmar Pedido
            </button>
            <Link
              to="/"
              className="mt-4 w-full inline-flex items-center justify-center bg-white text-green-700 border border-green-600 px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:bg-green-50 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
        </main>
      ) : (
        <main className="container mx-auto p-4 pt-10 pb-16 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Carrito de Compras</h1>
          <p className="text-lg text-gray-600 mb-8">Tu carrito está vacío. ¡Agrega productos para continuar!</p>
          <Link to="/" className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition">
            Volver a Comprar
          </Link>
        </main>
      )}

    </ScrollReveal>
  );
};

export default CartPage;