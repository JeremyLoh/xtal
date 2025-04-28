import { usePodcastCardContext } from "./PodcastCardContext.ts"
import { Link } from "react-router"
import Pill from "../Pill/Pill.tsx"
import { podcastCategoryPage } from "../../paths.ts"

const Categories = function PodcastCardCategories() {
  const { podcast } = usePodcastCardContext()
  return (
    podcast.categories &&
    podcast.categories.map((category, index) => {
      return (
        <Link to={podcastCategoryPage(category)}>
          <Pill key={`${category}-${index}`}>{category}</Pill>
        </Link>
      )
    })
  )
}

export default Categories
