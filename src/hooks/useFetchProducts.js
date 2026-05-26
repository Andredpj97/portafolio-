import { useState, useEffect } from 'react'
import { sampleProducts } from '../data/sampleProducts'

/**
 * Hook personalizado para simular fetch de productos con manejo de errores.
 * @param {boolean} shouldFetch - Si debe hacer fetch.
 * @returns {object} { products, loading, error }
 */
const useFetchProducts = (shouldFetch = true) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!shouldFetch) return

    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Simular error aleatorio (10% de probabilidad)
        if (Math.random() < 0.1) {
          throw new Error('Error de red: No se pudieron cargar los productos')
        }
        setProducts(sampleProducts)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [shouldFetch])

  return { products, loading, error }
}

export default useFetchProducts