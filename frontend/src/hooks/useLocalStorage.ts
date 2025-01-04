import { useEffect, useState } from "react"

function getStoredValue(key: string, defaultValue: unknown) {
  const savedValue = localStorage.getItem(key)
  if (savedValue == null) {
    return defaultValue
  }
  return JSON.parse(savedValue)
}

function useLocalStorage<T>(
  key: string,
  defaultValue: unknown
): [T, React.Dispatch<T>] {
  const [value, setValue] = useState(() => getStoredValue(key, defaultValue))
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue]
}

export default useLocalStorage
