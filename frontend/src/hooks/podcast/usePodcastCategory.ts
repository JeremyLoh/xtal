import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { PodcastCategory } from "../../api/podcast/model/podcast.ts"
import { getAllPodcastCategories } from "../../api/podcast/podcastCategory.ts"
import useCache, { CacheType } from "../useCache.ts"

type CacheCategory = {
  categories: PodcastCategory[]
}

function usePodcastCategory() {
  const cacheKey = useMemo(() => `usePodcastCategory`, [])
  const { setCacheItem, getCacheItem } = useCache<CacheCategory>(cacheKey, 60)
  const [categoryCache, setCategoryCache] =
    useState<CacheType<CacheCategory> | null>(null)

  const abortController = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<PodcastCategory[] | null>(
    categoryCache ? categoryCache.value.categories : null
  )

  const handleCategoryRefresh = useCallback(async () => {
    setLoading(true)
    abortController.current?.abort()
    abortController.current = new AbortController()
    try {
      const categories = await getAllPodcastCategories(abortController.current)
      if (categories) {
        setCategories(categories)
      } else {
        setLoading(false) // prevent infinite load on no data
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
      setLoading(false) // prevent infinite load on error
    }
  }, [])

  useEffect(() => {
    // update the category loading state to false after the state has been updated
    // prevents display of "no categories available" element due to categories = null, and loading = false
    if (categories) {
      setLoading(false)
      setCacheItem({ categories })
    }
  }, [categories, setCacheItem])

  useEffect(() => {
    async function getCache() {
      setLoading(true)
      try {
        const categoryCache = await getCacheItem()
        if (categoryCache) {
          setCacheItem(categoryCache.value)
          setCategoryCache(categoryCache)
          setCategories(categoryCache.value.categories)
        }
      } finally {
        setLoading(false)
      }
    }
    getCache()
  }, [getCacheItem, setCacheItem])

  const output = useMemo(() => {
    return {
      loading,
      categories,
      onRefresh: handleCategoryRefresh,
    }
  }, [loading, categories, handleCategoryRefresh])

  return output
}

export default usePodcastCategory
