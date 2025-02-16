import "./PodcastCategoryPage.css"
import { useEffect } from "react"
import { useParams } from "react-router"
import TrendingPodcastSection from "../../../features/podcast/trending/components/TrendingPodcastSection/TrendingPodcastSection"

export default function PodcastCategoryPage() {
  const { categoryName } = useParams()
  useEffect(() => {
    if (categoryName) {
      document.title = `xtal - ${decodeURIComponent(
        categoryName
      ).toLowerCase()} podcasts`
    }
  }, [categoryName])

  if (!categoryName) {
    return null
  }
  return (
    <div className="podcast-category-container">
      <h2 className="podcast-category-title">
        {decodeURIComponent(categoryName)}
      </h2>
      <TrendingPodcastSection category={categoryName} />
    </div>
  )
}
