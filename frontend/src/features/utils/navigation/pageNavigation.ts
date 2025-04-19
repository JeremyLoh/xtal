const getPodcastDetailPath = ({
  podcastTitle,
  podcastId,
}: {
  podcastTitle: string
  podcastId: string
}) => {
  return `/podcasts/${encodeURIComponent(podcastTitle)}/${podcastId}`
}

export { getPodcastDetailPath }
