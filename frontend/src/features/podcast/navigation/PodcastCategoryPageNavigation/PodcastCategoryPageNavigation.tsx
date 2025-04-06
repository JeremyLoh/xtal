import { memo } from "react"
import Breadcrumb from "../../../../components/ui/breadcrumb/index.tsx"

type PodcastCategoryPageNavigationProps = {
  categoryName: string
}

function PodcastCategoryPageNavigation({
  categoryName,
}: PodcastCategoryPageNavigationProps) {
  return (
    <Breadcrumb>
      <Breadcrumb.Link
        href="/podcasts"
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
