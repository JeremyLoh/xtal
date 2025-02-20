import "./PodcastHomePage.css"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import TrendingPodcastSection from "../../../features/podcast/trending/components/TrendingPodcastSection/TrendingPodcastSection"
import PodcastCategorySection from "../../../features/podcast/category/components/PodcastCategorySection/PodcastCategorySection"
import { PodcastCategory } from "../../../api/podcast/model/podcast"
import { getAllPodcastCategories } from "../../../api/podcast/podcastCategory"
import Spinner from "../../../components/Spinner/Spinner"

export default function PodcastHomePage() {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<PodcastCategory[] | null>(null)

  useEffect(() => {
    document.title = "xtal - podcasts"
    getPodcastCategories()
  }, [])

  async function getPodcastCategories() {
    setLoading(true)
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    try {
      const categories = await getAllPodcastCategories(
        abortControllerRef.current
      )
      if (categories) {
        setCategories(categories)
      } else {
        setCategories(null)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="podcast-home-page-container">
      <Spinner isLoading={loading} />
      <PodcastCategorySection
        loading={loading}
        categories={categories}
        onRefresh={getPodcastCategories}
      />
      <TrendingPodcastSection />
    </div>
  )
}
