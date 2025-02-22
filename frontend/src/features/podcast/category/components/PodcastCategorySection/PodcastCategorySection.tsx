import "./PodcastCategorySection.css"
import { useNavigate } from "react-router"
import { motion } from "motion/react"
import { IoReload } from "react-icons/io5"
import Slider from "../../../../../components/Slider/Slider.tsx"
import { PodcastCategory } from "../../../../../api/podcast/model/podcast.ts"
import useScreenDimensions from "../../../../../hooks/useScreenDimensions.ts"

type PodcastCategorySectionProps = {
  loading: boolean
  categories: PodcastCategory[] | null
  onRefresh: () => Promise<void>
}

export default function PodcastCategorySection({
  loading,
  categories,
  onRefresh,
}: PodcastCategorySectionProps) {
  const navigate = useNavigate()
  const { isMobile } = useScreenDimensions()
  const SCROLL_AMOUNT = isMobile ? 500 : 700

  async function handleRefreshPodcastCategories() {
    await onRefresh()
  }

  function handlePodcastCategorySelect(category: PodcastCategory) {
    navigate(`/podcasts/${category.name}`)
  }

  function renderCategories() {
    if (loading) {
      return
    }
    if (!categories) {
      return (
        <div className="podcast-category-placeholder-section">
          <p>Could not get podcast categories. Please try again later</p>
          <button
            className="refresh-podcast-categories-button"
            disabled={loading}
            onClick={handleRefreshPodcastCategories}
            aria-label="refresh podcast categories"
            title="refresh podcast categories"
          >
            <IoReload size={20} /> Refresh
          </button>
        </div>
      )
    }
    return (
      <Slider className="podcast-category-slider" scrollAmount={SCROLL_AMOUNT}>
        {categories.map((category) => {
          return (
            <div key={category.id}>
              <motion.button
                className="podcast-category-slider-option"
                onClick={() => handlePodcastCategorySelect(category)}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                {category.name}
              </motion.button>
            </div>
          )
        })}
      </Slider>
    )
  }

  return (
    <div className="podcast-category-container">
      <h2 className="podcast-category-title">Categories</h2>
      {renderCategories()}
    </div>
  )
}
