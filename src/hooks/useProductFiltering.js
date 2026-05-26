import { useMemo } from 'react'

const useProductFiltering = (products, selectedCategory = '', searchTerm = '', headerFilter) => {
  return useMemo(() => {
    let list = products

    if (selectedCategory) {
      list = list.filter((product) => product.category === selectedCategory)
    }

    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase()
      list = list.filter((product) =>
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term)
      )
    }

    if (headerFilter) {
      const [minPrice, maxPriceFilter] = headerFilter.priceRange
      list = list.filter((product) => {
        const price = parseFloat(product.price)
        const inPriceRange = price >= minPrice && price <= maxPriceFilter
        const inBrands = headerFilter.brands.length === 0 || headerFilter.brands.includes(product.brand)
        const inType = !headerFilter.type || product.type === headerFilter.type
        return inPriceRange && inBrands && inType
      })
    }

    return list
  }, [products, selectedCategory, searchTerm, headerFilter])
}

export default useProductFiltering
