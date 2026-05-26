import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'

const ProductList = ({ products, loading = false }) => {
  if (loading) {
    return (
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </motion.div>
  )
}

export default ProductList

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.string,
  })).isRequired,
  loading: PropTypes.bool,
}
