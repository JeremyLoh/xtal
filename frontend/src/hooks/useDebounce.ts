import { useEffect, useState } from "react"

function useDebounce<T>(value: T, delayInMs: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delayInMs)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delayInMs])

  return debouncedValue
}

export default useDebounce
