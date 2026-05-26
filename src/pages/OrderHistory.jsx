import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';
import { useUi } from '../context/UiContext';

/**
 * Componente OrderHistory - Historial de órdenes del usuario.
 * Muestra todas las órdenes pasadas con detalles de productos y montos.
 */
const OrderHistory = () => {
  const { orderHistory, deleteOrder, clearOrderHistory } = useContext(CartContext);
  const { showConfirm } = useUi();

  const paymentLabels = {
    mercadopago: 'Mercado Pago',
    wompi: 'Wompi (Bancolombia)',
    stripe: 'Stripe',
  };

  if (orderHistory.length === 0) {
    return (
      <ScrollReveal>
        <main className="container mx-auto p-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Historial de Órdenes</h1>
          <p className="text-lg text-gray-600 mb-8">No tienes órdenes aún. ¡Comienza a comprar!</p>
          <Link to="/" className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition">
            Ir a Comprar
          </Link>
        </main>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal>
      <main className="container mx-auto p-4 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Historial de Órdenes</h1>
          <button
            onClick={() => {
              showConfirm({
                title: 'Borrar todas las ordenes',
                message: '¿Estás seguro de que deseas borrar todo el historial de órdenes?'
                  + ' Esta accion no se puede deshacer.',
                onConfirm: clearOrderHistory,
              });
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-700 font-semibold shadow-sm hover:bg-red-600 hover:text-white transition"
          >
            Borrar todas
          </button>
        </div>

        <div className="space-y-6">
          {orderHistory.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Orden #</p>
                  <p className="text-lg font-bold text-gray-800">{order.id}</p>
                  {order.paymentMethod && (
                    <p className="text-xs text-gray-500 mt-1">
                      Pago: {paymentLabels[order.paymentMethod] || order.paymentMethod}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    showConfirm({
                      title: 'Borrar orden',
                      message: '¿Deseas borrar esta orden de tu historial?',
                      onConfirm: () => deleteOrder(order.id),
                    });
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-700 font-semibold hover:bg-red-600 hover:text-white transition"
                >
                  Borrar orden
                </button>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="text-lg font-semibold text-gray-800">{order.date}</p>
                </div>
              </div>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Producto</th>
                      <th className="px-4 py-2 text-center">Cantidad</th>
                      <th className="px-4 py-2 text-right">Precio Unitario</th>
                      <th className="px-4 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-2">
                          <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.brand}</p>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">S/ {parseFloat(item.price).toFixed(2)}</td>
                        <td className="px-4 py-2 text-right font-semibold">
                          S/ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mb-4">
                <div className="text-right">
                  <p className="text-gray-600 mb-2">Total de la orden:</p>
                  <p className="text-2xl font-bold text-green-600">S/ {order.total}</p>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-right">
                {new Date(order.timestamp).toLocaleString('es-PE')}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="inline-block text-green-600 hover:text-green-700 font-semibold">
            ← Volver a la tienda
          </Link>
        </div>
      </main>
    </ScrollReveal>
  );
};

export default OrderHistory;
