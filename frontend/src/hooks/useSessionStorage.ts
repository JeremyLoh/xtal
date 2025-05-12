import { useCallback, useMemo } from "react"

function useSessionStorage(key: string) {
  const getItem = useCallback(() => {
    const savedValue = sessionStorage.getItem(key)
    if (savedValue) {
      return JSON.parse(savedValue)
    } else {
      return null
    }
  }, [key])

  const setItem = useCallback(
    (value: unknown) => {
      sessionStorage.setItem(key, JSON.stringify(value))
    },
    [key]
  )

  const removeItem = useCallback(() => {
    sessionStorage.removeItem(key)
  }, [key])

  const sessionStorageFunctions = useMemo(() => {
    return { getItem, setItem, removeItem }
  }, [getItem, setItem, removeItem])

  return sessionStorageFunctions
}

export default useSessionStorage
