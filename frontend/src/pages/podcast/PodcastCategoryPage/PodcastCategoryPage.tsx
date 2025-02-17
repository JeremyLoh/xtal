import "./PodcastCategoryPage.css"
import { useEffect } from "react"
import { Link, useParams } from "react-router"
import { IoArrowBackSharp } from "react-icons/io5"
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
      <Link
        to="/podcasts"
        style={{ textDecoration: "none", width: "fit-content" }}
      >
        <button className="podcast-category-back-button">
          <IoArrowBackSharp size={16} />
          Back
        </button>
      </Link>
      <h2 className="podcast-category-title">
        {decodeURIComponent(categoryName)}
      </h2>
      <TrendingPodcastSection category={categoryName} />
    </div>
  )
}
