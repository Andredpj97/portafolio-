import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Componente Toast - Notificación flotante que aparece temporalmente.
 * Muestra mensajes de éxito, error, etc. al usuario.
 */
const Toast = ({ message, isVisible, duration = 3000, variant = 'success' }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible) {
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const styles = variant === 'error'
    ? 'bg-red-600 text-white'
    : 'bg-green-600 text-white';

  const icon = variant === 'error' ? '!' : '✓';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-sm md:top-20 md:right-4 md:left-auto md:bottom-auto md:translate-x-0 md:w-auto px-4 md:px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 ${styles}`}
        >
          <span className="text-xl">{icon}</span>
          <span className="font-semibold leading-snug">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  duration: PropTypes.number,
  variant: PropTypes.oneOf(['success', 'error']),
};