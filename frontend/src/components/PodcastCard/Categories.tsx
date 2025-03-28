import { usePodcastCardContext } from "./PodcastCardContext.ts"
import Pill from "../Pill/Pill.tsx"

const Categories = function PodcastCardCategories() {
  const { podcast } = usePodcastCardContext()
  return (
    podcast.categories &&
    podcast.categories.map((category, index) => {
      return (
        <Pill
          className="podcast-card-category-pill"
          key={`${category}-${index}`}
        >
          {category}
        </Pill>
      )
    })
  )
}

export default Categories
