import { memo } from "react"
import Breadcrumb from "../../../../components/ui/breadcrumb/index.tsx"
import { Podcast } from "../../../../api/podcast/model/podcast.ts"

type PodcastDetailPageNavigationProps = {
  podcast: Podcast | null
  podcastTitle: string | undefined
}

function PodcastDetailPageNavigation({
  podcast,
  podcastTitle,
}: PodcastDetailPageNavigationProps) {
  return (
    <Breadcrumb>
      <Breadcrumb.Link
        href="/podcasts"
        data-testid="podcast-detail-page-podcasts-link"
      >
        Podcasts
      </Breadcrumb.Link>
      <Breadcrumb.Separator size={16} />
      {podcast && podcast.categories && podcast.categories.length > 0 && (
        <>
          <Breadcrumb.Link
            href={`/podcasts/${podcast.categories[0]}`}
            data-testid="podcast-detail-page-category-link"
          >
            {podcast.categories[0]}
          </Breadcrumb.Link>
          <Breadcrumb.Separator size={16} />
        </>
      )}
      <Breadcrumb.Item>{podcastTitle}</Breadcrumb.Item>
    </Breadcrumb>
  )
}

export default memo(PodcastDetailPageNavigation)
