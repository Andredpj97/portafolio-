import { useId } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Componente ConfirmDialog - Modal de confirmación personalizado
 * Reemplaza los alert nativos con un diseño atractivo y coherente
 */

// Iconos personalizados
const WarningIcon = () => (
  <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 20h20L12 2z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ConfirmDialog = ({ isOpen, title, message, productName, onConfirm, onCancel }) => {
  const titleId = useId();
  const messageId = useId();

  // Determinar tipo de acción (si contiene palabras clave)
  const isDestructive = title.toLowerCase().includes('eliminar') || title.toLowerCase().includes('vaciar')
  const isDangerous = title.toLowerCase().includes('peligro') || title.toLowerCase().includes('advertencia')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={messageId}
          >
            <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-[0_30px_80px_rgba(15,23,42,0.18)] overflow-hidden">
              {/* Header */}
              <div className={`relative overflow-hidden py-10 px-6 text-center ${
                isDestructive
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-white/20 -mr-16 -mt-16"></div>
                </div>

                <div className="relative z-10 flex justify-center mb-4">
                  {isDestructive ? <WarningIcon /> : <CheckIcon />}
                </div>

                <h2 id={titleId} className="relative z-10 text-2xl font-bold tracking-tight">
                  {title}
                </h2>
              </div>

              {/* Body */}
              <div className="p-8">
                <p id={messageId} className="text-slate-600 mb-6 text-center leading-relaxed font-medium">
                  {message}
                </p>

                {productName && (
                  <div className="rounded-3xl border-l-4 border-orange-400 bg-slate-50 p-5 mb-6 shadow-sm">
                    <p className="text-sm text-slate-500 mb-2">Producto:</p>
                    <p className="text-lg font-semibold text-slate-900 break-words">
                      "{productName}"
                    </p>
                  </div>
                )}

                <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700 text-center shadow-sm">
                  ⚠️ Esta acción no puede deshacerse.
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-3 px-8 pb-8 pt-4 bg-white border-t border-gray-200 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  autoFocus
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="flex-1 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-red-700"
                >
                  {isDestructive ? 'Eliminar' : 'Confirmar'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  productName: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
