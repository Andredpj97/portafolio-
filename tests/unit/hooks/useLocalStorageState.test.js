import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useLocalStorageState from '../../../src/hooks/useLocalStorageState'

describe('useLocalStorageState Hook', () => {
  const key = 'testKey'

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorageState(key, 'defaultValue'))
    expect(result.current[0]).toBe('defaultValue')
  })

  it('should initialize with localStorage value if exists', () => {
    localStorage.setItem(key, JSON.stringify('savedValue'))
    const { result } = renderHook(() => useLocalStorageState(key, 'defaultValue'))
    expect(result.current[0]).toBe('savedValue')
  })

  it('should update state and localStorage when setState is called', () => {
    const { result } = renderHook(() => useLocalStorageState(key, 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(JSON.parse(localStorage.getItem(key))).toBe('updated')
  })

  it('should handle complex objects', () => {
    const initialObject = { name: 'Test', count: 0 }
    const { result } = renderHook(() => useLocalStorageState(key, initialObject))

    expect(result.current[0]).toEqual(initialObject)

    const updatedObject = { name: 'Test', count: 1 }
    act(() => {
      result.current[1](updatedObject)
    })

    expect(result.current[0]).toEqual(updatedObject)
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorageState(key, 0))

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(2)
  })
})
