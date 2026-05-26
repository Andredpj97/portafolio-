import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

/**
 * Componente de skeleton para simular la carga de una tarjeta de producto.
 */
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="relative p-4">
        <Skeleton height={144} className="rounded" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <Skeleton width={100} height={12} className="mb-2" />
        <Skeleton height={20} className="mb-3" />
        <Skeleton height={16} className="mb-2" />
        <Skeleton width={80} height={16} />
      </div>
    </div>
  )
}

export default ProductCardSkeleton