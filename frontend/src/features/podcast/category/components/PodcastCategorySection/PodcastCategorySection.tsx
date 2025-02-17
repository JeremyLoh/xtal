import "./PodcastCategorySection.css"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { motion } from "motion/react"
import { toast } from "sonner"
import { IoReload } from "react-icons/io5"
import Slider from "../../../../../components/Slider/Slider"
import Spinner from "../../../../../components/Spinner/Spinner"
import { getAllPodcastCategories } from "../../../../../api/podcast/podcastCategory"
import { PodcastCategory } from "../../../../../api/podcast/model/podcast"
import useScreenDimensions from "../../../../../hooks/useScreenDimensions"

export default function PodcastCategorySection() {
  const navigate = useNavigate()
  const { isMobile } = useScreenDimensions()
  const SCROLL_AMOUNT = isMobile ? 500 : 700
  const abortControllerRef = useRef<AbortController | null>(null)
  const [categories, setCategories] = useState<PodcastCategory[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
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
    }
    setLoading(false)
  }

  async function handleRefreshPodcastCategories() {
    await getPodcastCategories()
  }

  function handlePodcastCategorySelect(category: PodcastCategory) {
    navigate(`/podcasts/${category.name}`)
  }

  return (
    <div className="podcast-category-container">
      <h2 className="podcast-category-title">Categories</h2>
      {categories ? (
        <Slider
          className="podcast-category-slider"
          scrollAmount={SCROLL_AMOUNT}
        >
          {categories &&
            categories.map((category) => {
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
      ) : (
        <div className="podcast-category-placeholder-section">
          <Spinner isLoading={loading} />
          {!loading && (
            <p>Could not get podcast categories. Please try again later</p>
          )}
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
      )}
    </div>
  )
}
