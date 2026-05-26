import { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * CartContext - Contexto global para manejar el carrito de compras.
 * Proporciona funciones para agregar, eliminar y actualizar productos en el carrito.
 * Los datos se persisten en localStorage.
 */
const CartContext = createContext();

const MAX_QUANTITY_PER_PRODUCT = 20;

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const [orderHistory, setOrderHistory] = useState([]);

  const getOrderStorageKey = (currentUser) => {
    if (!currentUser || !currentUser.uid) return 'orderHistory:guest';
    return `orderHistory:${currentUser.uid}`;
  };

  const getCartStorageKey = (currentUser) => {
    if (!currentUser || !currentUser.uid) return 'cart:guest';
    return `cart:${currentUser.uid}`;
  };

  const safeParse = (value, fallback) => {
    if (!value) return fallback;
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  };

  // Cargar carrito segun el usuario autenticado
  useEffect(() => {
    const storageKey = getCartStorageKey(user);
    const savedCart = localStorage.getItem(storageKey);
    const parsedCart = safeParse(savedCart, []);
    setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
  }, [user]);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    const storageKey = getCartStorageKey(user);
    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    } catch (error) {
      // Ignore storage write errors (quota, blocked storage, etc.)
    }
  }, [cartItems, user]);

  // Cargar historial de ordenes segun el usuario autenticado
  useEffect(() => {
    const storageKey = getOrderStorageKey(user);
    const savedHistory = localStorage.getItem(storageKey);
    const parsedHistory = safeParse(savedHistory, []);
    setOrderHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
  }, [user]);

  // Guardar historial en localStorage cada vez que cambie
  useEffect(() => {
    const storageKey = getOrderStorageKey(user);
    try {
      localStorage.setItem(storageKey, JSON.stringify(orderHistory));
    } catch (error) {
      // Ignore storage write errors (quota, blocked storage, etc.)
    }
  }, [orderHistory, user]);

  // Agregar o actualizar cantidad de producto en el carrito
  const addToCart = (product) => {
    let added = true;
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      if (existingIndex !== -1) {
        const existingItem = prevItems[existingIndex];
        // No agregar si ya alcanzó el máximo
        if (existingItem.quantity >= MAX_QUANTITY_PER_PRODUCT) {
          added = false;
          return prevItems;
        }
        const updatedItem = { ...existingItem, quantity: existingItem.quantity + 1 };
        const remainingItems = prevItems.filter((_, index) => index !== existingIndex);
        return [updatedItem, ...remainingItems];
      }
      return [{ ...product, quantity: 1 }, ...prevItems];
    });
    if (added) {
      // Enviar notificación push si es soportado
      if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification('Producto agregado', {
            body: `${product.name} agregado al carrito`,
            icon: '/vite.svg',
            badge: '/vite.svg',
            tag: 'cart-add'
          });
        });
      }
    }
    return added;
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Actualizar cantidad de producto con validación
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return true;
    } else if (quantity > MAX_QUANTITY_PER_PRODUCT) {
      return false;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
    return true;
  };

  // Crear orden desde carrito actual
  const createOrder = (paymentMethod) => {
    if (cartItems.length === 0) return null;
    
    const order = {
      id: Date.now(),
      items: cartItems,
      total: getTotalPrice(),
      date: new Date().toLocaleDateString('es-PE'),
      timestamp: new Date().toISOString(),
      paymentMethod: paymentMethod || null,
    };
    
    setOrderHistory((prev) => [order, ...prev]);
    setCartItems([]);
    return order;
  };

  const deleteOrder = (orderId) => {
    setOrderHistory((prev) => prev.filter((order) => order.id !== orderId));
  };

  const clearOrderHistory = () => {
    setOrderHistory([]);
  };

  // Vaciar carrito completo
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular total del carrito
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  };

  // Obtener cantidad total de items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, orderHistory, createOrder, clearCart, deleteOrder, clearOrderHistory }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;