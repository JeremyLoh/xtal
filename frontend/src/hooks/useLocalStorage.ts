import { useCallback, useMemo } from "react"

function useLocalStorage(key: string) {
  const getItem = useCallback(() => {
    try {
      const savedValue = localStorage.getItem(key)
      if (savedValue) {
        return JSON.parse(savedValue)
      } else {
        return null
      }
    } catch {
      return null
    }
  }, [key])

  const setItem = useCallback(
    (value: unknown) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    [key]
  )

  const removeItem = useCallback(() => {
    localStorage.removeItem(key)
  }, [key])

  const localStorageFunctions = useMemo(() => {
    return { getItem, setItem, removeItem }
  }, [getItem, setItem, removeItem])

  return localStorageFunctions
}

export default useLocalStorage
