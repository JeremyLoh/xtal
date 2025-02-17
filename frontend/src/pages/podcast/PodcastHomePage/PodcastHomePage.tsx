import "./PodcastHomePage.css"
import { useEffect } from "react"
import TrendingPodcastSection from "../../../features/podcast/trending/components/TrendingPodcastSection/TrendingPodcastSection"
import PodcastCategorySection from "../../../features/podcast/category/components/PodcastCategorySection/PodcastCategorySection"

export default function PodcastHomePage() {
  useEffect(() => {
    document.title = "xtal - podcasts"
  }, [])

  return (
    <div id="podcast-home-page-container">
      <PodcastCategorySection />
      <TrendingPodcastSection />
    </div>
  )
}
