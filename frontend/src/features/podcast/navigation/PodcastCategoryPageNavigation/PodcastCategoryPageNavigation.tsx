import { memo } from "react"
import Breadcrumb from "../../../../components/ui/breadcrumb/index.tsx"
import { podcastHomePage } from "../../../../paths.ts"

type PodcastCategoryPageNavigationProps = {
  categoryName: string
}

function PodcastCategoryPageNavigation({
  categoryName,
}: PodcastCategoryPageNavigationProps) {
  return (
    <Breadcrumb>
      <Breadcrumb.Link
        href={podcastHomePage()}
        data-testid="podcast-category-page-podcasts-link"
      >
        Podcasts
      </Breadcrumb.Link>
      <Breadcrumb.Separator size={16} />
      <Breadcrumb.Item>Categories</Breadcrumb.Item>
      <Breadcrumb.Separator size={16} />
      <Breadcrumb.Item>{categoryName}</Breadcrumb.Item>
    </Breadcrumb>
  )
}

export default memo(PodcastCategoryPageNavigation)
