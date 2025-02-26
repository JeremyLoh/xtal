import { useCallback, useMemo } from "react"
import dayjs from "dayjs"
import useLocalStorage from "./useLocalStorage.ts"

const STALE_TIME_MINUTES = 5

type CacheType<V> = {
  lastFetchedEpochMs: number
  value: V
}

function useCache<V>(key: string) {
  const { getItem, setItem, removeItem } = useLocalStorage(key)
  const setCacheItem = useCallback(
    (value: V) => {
      setItem({ lastFetchedEpochMs: dayjs().unix(), value })
    },
    [setItem]
  )

  const getCacheItem = useCallback(() => {
    const cachedData = getItem() as CacheType<V>
    if (cachedData == null) {
      return null
    }
    const currentTimestamp = dayjs()
    const cachedTimestamp = dayjs.unix(cachedData.lastFetchedEpochMs)
    const expiredTimestamp = cachedTimestamp.add(STALE_TIME_MINUTES, "minute")
    if (cachedData && currentTimestamp.isBefore(expiredTimestamp)) {
      return cachedData
    } else if (cachedData && currentTimestamp.isAfter(expiredTimestamp)) {
      removeItem()
      return null
    } else {
      return null
    }
  }, [getItem, removeItem])

  const cacheFunctions = useMemo(() => {
    return { setCacheItem, getCacheItem }
  }, [setCacheItem, getCacheItem])

  return cacheFunctions
}

export default useCache
