import { memo } from "react"
import Breadcrumb from "../../../../components/ui/breadcrumb/index.tsx"
import { podcastHomePage } from "../../../../paths.ts"

type PodcastEpisodeDetailPageNavigationProps = {
  podcastId: string | undefined
  podcastTitle: string | undefined
}

function PodcastEpisodeDetailPageNavigation({
  podcastId,
  podcastTitle,
}: PodcastEpisodeDetailPageNavigationProps) {
  return (
    <Breadcrumb>
      <Breadcrumb.Link
        href={podcastHomePage()}
        data-testid="podcast-episode-detail-podcasts-link"
      >
        Podcasts
      </Breadcrumb.Link>
      <Breadcrumb.Separator size={16} />
      <Breadcrumb.Link
        href={`/podcasts/${podcastTitle}/${podcastId}`}
        data-testid="podcast-episode-detail-page-link"
      >
        {podcastTitle}
      </Breadcrumb.Link>
    </Breadcrumb>
  )
}

export default memo(PodcastEpisodeDetailPageNavigation)
