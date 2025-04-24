import "./PodcastCategorySection.css"
import { memo, useCallback } from "react"
import { useNavigate } from "react-router"
import { IoReload } from "react-icons/io5"
import Slider from "../../../../components/Slider/Slider.tsx"
import { PodcastCategory } from "../../../../api/podcast/model/podcast.ts"
import useScreenDimensions from "../../../../hooks/useScreenDimensions.ts"
import Button from "../../../../components/ui/button/Button.tsx"
import { podcastCategoryPage } from "../../../../paths.ts"

type PodcastCategorySectionProps = {
  categories: PodcastCategory[] | null
  onRefresh: () => Promise<void>
}

function PodcastCategorySection({
  categories,
  onRefresh,
}: PodcastCategorySectionProps) {
  const navigate = useNavigate()
  const { isMobile } = useScreenDimensions()
  const SCROLL_AMOUNT = isMobile ? 500 : 700

  const handleRefreshPodcastCategories = useCallback(async () => {
    await onRefresh()
  }, [onRefresh])

  const handlePodcastCategorySelect = useCallback(
    (category: PodcastCategory) => {
      navigate(podcastCategoryPage(category.name))
    },
    [navigate]
  )

  function renderCategories() {
    if (!categories) {
      return (
        <div className="podcast-category-placeholder-section">
          <p>Could not get podcast categories. Please try again later</p>
          <Button
            keyProp="refresh-podcast-categories-button"
            variant="primary"
            className="refresh-podcast-categories-button"
            onClick={handleRefreshPodcastCategories}
            aria-label="refresh podcast categories"
            title="refresh podcast categories"
          >
            <IoReload size={20} /> Refresh
          </Button>
        </div>
      )
    }
    return (
      <Slider className="podcast-category-slider" scrollAmount={SCROLL_AMOUNT}>
        {categories.map((category) => {
          return (
            <Button
              keyProp={`${category.id}`}
              className="podcast-category-slider-option"
              onClick={() => handlePodcastCategorySelect(category)}
            >
              {category.name}
            </Button>
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

export default memo(PodcastCategorySection)
