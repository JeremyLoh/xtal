import "./ProfileHistoryPage.css"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import usePlayHistory, {
  PlayHistoryPodcastEpisode,
} from "../../hooks/podcast/usePlayHistory.ts"
import PodcastEpisodeHistory from "../../features/profile/history/PodcastEpisodeHistory/PodcastEpisodeHistory.tsx"
import Pagination from "../../components/Pagination/Pagination.tsx"

const IMAGE_LAZY_LOAD_START_INDEX = 2
const LIMIT_PER_PAGE = 10

function ProfileHistoryPage() {
  const {
    session,
    loading,
    totalPlayedPodcastEpisodes,
    getPlayedPodcastEpisodes,
    deletePlayedPodcastEpisode,
  } = usePlayHistory()
  const [episodes, setEpisodes] = useState<PlayHistoryPodcastEpisode[] | null>(
    null
  )
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    document.title = "xtal - profile - history"
  }, [])

  useEffect(() => {
    if (session.loading) {
      return
    }
    getPlayedPodcastEpisodes(LIMIT_PER_PAGE).then((data) => {
      if (data) {
        setEpisodes(data)
      }
    })
  }, [session, getPlayedPodcastEpisodes])

  const handlePodcastEpisodeDelete = async (episodeId: number) => {
    if (episodes == null) {
      return
    }
    await deletePlayedPodcastEpisode(`${episodeId}`)
    setEpisodes(episodes.filter((e) => e.podcastEpisode.id !== episodeId))
    toast.success("Deleted podcast episode from listen history")
  }

  const handlePreviousPageClick = useCallback(
    async (currentPage: number) => {
      if (currentPage === 1) {
        return
      }
      setPage(currentPage - 1)
      const offset = (currentPage - 2) * LIMIT_PER_PAGE
      const data = await getPlayedPodcastEpisodes(LIMIT_PER_PAGE, offset)
      setEpisodes(data)
    },
    [getPlayedPodcastEpisodes]
  )

  const handleNextPageClick = useCallback(
    async (currentPage: number) => {
      if (
        currentPage ===
        Math.ceil((totalPlayedPodcastEpisodes || 0) / LIMIT_PER_PAGE)
      ) {
        return
      }
      setPage(currentPage + 1)
      const offset = currentPage * LIMIT_PER_PAGE
      const data = await getPlayedPodcastEpisodes(LIMIT_PER_PAGE, offset)
      setEpisodes(data)
    },
    [totalPlayedPodcastEpisodes, getPlayedPodcastEpisodes]
  )

  const handlePageClick = useCallback(
    async (pageNumber: number) => {
      if (pageNumber === page) {
        return
      }
      setPage(pageNumber)
      const offset = (pageNumber - 1) * LIMIT_PER_PAGE
      const data = await getPlayedPodcastEpisodes(LIMIT_PER_PAGE, offset)
      setEpisodes(data)
    },
    [page, getPlayedPodcastEpisodes]
  )

  return (
    <div className="profile-history-page-container">
      <h2 className="profile-history-page-title">Profile History</h2>
      <h3 className="profile-history-page-title">Podcast Listen History</h3>
      <LoadingDisplay loading={loading}>
        <Pagination
          className="profile-history-podcast-episode-pagination"
          currentPage={page}
          totalPages={Math.ceil(
            (totalPlayedPodcastEpisodes || 0) / LIMIT_PER_PAGE
          )}
          onPreviousPageClick={handlePreviousPageClick}
          onNextPageClick={handleNextPageClick}
          onPageClick={handlePageClick}
        />
        <PodcastEpisodeHistory
          IMAGE_LAZY_LOAD_START_INDEX={IMAGE_LAZY_LOAD_START_INDEX}
          episodeCountOffset={(page - 1) * LIMIT_PER_PAGE}
          episodes={episodes}
          onDelete={handlePodcastEpisodeDelete}
        />
      </LoadingDisplay>
    </div>
  )
}

export default ProfileHistoryPage
