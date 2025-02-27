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
    } catch (error) {
      console.error("useLocalStorage getItem error: ", error)
      return null
    }
  }, [key])

  const setItem = useCallback(
    (value: unknown) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error("useLocalStorage setItem error: ", error)
      }
    },
    [key]
  )

  const removeItem = useCallback(() => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("useLocalStorage removeItem error: ", error)
    }
  }, [key])

  const localStorageFunctions = useMemo(() => {
    return { getItem, setItem, removeItem }
  }, [getItem, setItem, removeItem])

  return localStorageFunctions
}

export default useLocalStorage
