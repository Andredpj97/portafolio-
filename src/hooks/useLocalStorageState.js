import { useEffect, useState } from 'react'

const isBrowser = typeof window !== 'undefined'

const readStorageValue = (key, initialValue) => {
  if (!isBrowser) {
    return typeof initialValue === 'function' ? initialValue() : initialValue
  }

  try {
    const storedValue = window.localStorage.getItem(key)
    if (storedValue === null) {
      return typeof initialValue === 'function' ? initialValue() : initialValue
    }
    return JSON.parse(storedValue)
  } catch (error) {
    return typeof initialValue === 'function' ? initialValue() : initialValue
  }
}

const useLocalStorageState = (key, initialValue) => {
  const [value, setValue] = useState(() => readStorageValue(key, initialValue))

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    try {
      if (value === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      // Ignore localStorage write errors
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorageState
