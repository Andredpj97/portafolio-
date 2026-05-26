import { motion, useReducedMotion } from 'framer-motion';

/**
 * Componente ScrollReveal - Envuelve contenido para animarlo al hacer scroll.
 * Usa Framer Motion para revelar el contenido con un efecto de fade-in y slide-up.
 */
const ScrollReveal = ({ children, delay = 0 }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.36, delay, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;