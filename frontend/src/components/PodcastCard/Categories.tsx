import { usePodcastCardContext } from "./PodcastCardContext.ts"
import { Link } from "react-router"
import Pill from "../Pill/Pill.tsx"
import { podcastCategoryPage } from "../../paths.ts"

const categoryLinkStyle = { textDecoration: "none", width: "fit-content" }

const Categories = function PodcastCardCategories() {
  const { podcast } = usePodcastCardContext()
  return (
    podcast.categories &&
    podcast.categories.map((category, index) => {
      return (
        <Link
          key={`category-link-${category}`}
          to={podcastCategoryPage(category)}
          style={categoryLinkStyle}
        >
          <Pill key={`${category}-${index}`}>{category}</Pill>
        </Link>
      )
    })
  )
}

export default Categories
