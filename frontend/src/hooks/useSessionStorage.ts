import { useCallback, useMemo } from "react"

function useSessionStorage(key: string) {
  const getItem = useCallback(() => {
    try {
      const savedValue = sessionStorage.getItem(key)
      if (savedValue) {
        return JSON.parse(savedValue)
      } else {
        return null
      }
    } catch (error) {
      console.error("useSessionStorage getItem error: ", error)
    }
  }, [key])

  const setItem = useCallback(
    (value: unknown) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error("useSessionStorage setItem error: ", error)
      }
    },
    [key]
  )

  const removeItem = useCallback(() => {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error("useSessionStorage removeItem error: ", error)
    }
  }, [key])

  const sessionStorageFunctions = useMemo(() => {
    return { getItem, setItem, removeItem }
  }, [getItem, setItem, removeItem])

  return sessionStorageFunctions
}

export default useSessionStorage
