import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useProductFiltering from '../../../src/hooks/useProductFiltering'

const mockProducts = [
  { id: 1, name: 'Producto 1', category: 'Medicamentos', brand: 'BrandA', price: '10.50' },
  { id: 2, name: 'Producto 2', category: 'Cuidado Personal', brand: 'BrandB', price: '15.00' },
  { id: 3, name: 'Producto 3', category: 'Medicamentos', brand: 'BrandA', price: '20.00' },
  { id: 4, name: 'Producto 4', category: 'Suplementos', brand: 'BrandC', price: '25.50' },
]

describe('useProductFiltering Hook', () => {
  it('should initialize with all products when no filters', () => {
    const { result } = renderHook(() => useProductFiltering(mockProducts, '', '', null))
    expect(result.current).toEqual(mockProducts)
  })

  it('should filter products by category', () => {
    const { result } = renderHook(() => 
      useProductFiltering(mockProducts, 'Medicamentos', '', null)
    )
    
    expect(result.current.length).toBe(2)
    expect(result.current.every((p) => p.category === 'Medicamentos')).toBe(true)
  })

  it('should filter products by search term', () => {
    const { result } = renderHook(() => 
      useProductFiltering(mockProducts, '', 'Producto 1', null)
    )
    
    expect(result.current.length).toBe(1)
    expect(result.current[0].name).toBe('Producto 1')
  })

  it('should filter products by brand search', () => {
    const { result } = renderHook(() => 
      useProductFiltering(mockProducts, '', 'BrandA', null)
    )
    
    expect(result.current.length).toBe(2)
    expect(result.current.every((p) => p.brand === 'BrandA')).toBe(true)
  })

  it('should apply multiple filters (category + search)', () => {
    const { result } = renderHook(() => 
      useProductFiltering(mockProducts, 'Medicamentos', 'Producto 1', null)
    )
    
    expect(result.current.length).toBe(1)
    expect(result.current[0].category).toBe('Medicamentos')
    expect(result.current[0].name).toBe('Producto 1')
  })

  it('should handle empty search term', () => {
    const { result } = renderHook(() => 
      useProductFiltering(mockProducts, '', '   ', null)  // Solo espacios
    )
    
    expect(result.current.length).toBe(mockProducts.length)
  })

  it('should be case insensitive', () => {
    const { result } = renderHook(() => 
      useProductFiltering(mockProducts, '', 'producto', null)
    )
    
    // Debería encontrar todos los productos que contengan "producto"
    expect(result.current.length).toBeGreaterThan(0)
  })
})
