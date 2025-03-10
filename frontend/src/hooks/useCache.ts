import { useCallback, useMemo } from "react"
import dayjs from "dayjs"
import useSessionStorage from "./useSessionStorage.ts"
import useThreadScheduler from "./useThreadScheduler.ts"

export type CacheType<V> = {
  expiryEpochMs: number
  value: V
}

function useCache<V>(key: string, cacheStaleTimeInMinutes: number) {
  const { yieldToMainThread } = useThreadScheduler()
  const { getItem, setItem, removeItem } = useSessionStorage(key)
  const setCacheItem = useCallback(
    (value: V) => {
      setItem({
        expiryEpochMs: dayjs().add(cacheStaleTimeInMinutes, "minute").unix(),
        value,
      })
    },
    [setItem, cacheStaleTimeInMinutes]
  )

  const getCacheItem = useCallback(async () => {
    const deadlineInMs = 50
    let lastYield = performance.now()
    const cachedData = getItem() as CacheType<V>
    if (cachedData == null) {
      return null
    }
    const currentTimestamp = dayjs()
    const cachedExpiredTimestamp = dayjs.unix(cachedData.expiryEpochMs)
    if (cachedData && currentTimestamp.isBefore(cachedExpiredTimestamp)) {
      return cachedData
    } else if (cachedData && currentTimestamp.isAfter(cachedExpiredTimestamp)) {
      removeItem()
    }
    if (performance.now() - lastYield > deadlineInMs) {
      await yieldToMainThread()
      lastYield = performance.now()
    }
    await clearExpiredCacheItems(yieldToMainThread)
    return null
  }, [getItem, removeItem, yieldToMainThread])

  const cacheFunctions = useMemo(() => {
    return { setCacheItem, getCacheItem }
  }, [setCacheItem, getCacheItem])

  return cacheFunctions
}

async function clearExpiredCacheItems(
  yieldToMainThread: () => Promise<unknown>
) {
  const deadlineInMs = 50
  let lastYield = performance.now()
  const currentTimestamp = dayjs()
  for (const key of Object.keys(sessionStorage)) {
    if (performance.now() - lastYield > deadlineInMs) {
      await yieldToMainThread()
      lastYield = performance.now()
    }
    const savedValue = sessionStorage.getItem(key)
    if (!savedValue) {
      return
    }
    const json = JSON.parse(savedValue)
    const expiryTimestamp = dayjs.unix(json.expiryEpochMs)
    if (json.expiryEpochMs && currentTimestamp.isAfter(expiryTimestamp)) {
      sessionStorage.removeItem(key)
    }
  }
}

export default useCache
