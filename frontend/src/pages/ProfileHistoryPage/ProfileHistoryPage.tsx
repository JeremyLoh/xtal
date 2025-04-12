import "./ProfileHistoryPage.css"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import usePlayHistory, {
  PlayHistoryPodcastEpisode,
} from "../../hooks/podcast/usePlayHistory.ts"
import PodcastEpisodeHistory from "../../features/profile/history/PodcastEpisodeHistory/PodcastEpisodeHistory.tsx"

const IMAGE_LAZY_LOAD_START_INDEX = 2

function ProfileHistoryPage() {
  const {
    session,
    loading,
    getPlayedPodcastEpisodes,
    deletePlayedPodcastEpisode,
  } = usePlayHistory()
  const [episodes, setEpisodes] = useState<PlayHistoryPodcastEpisode[] | null>(
    null
  )

  useEffect(() => {
    document.title = "xtal - profile - history"
  }, [])

  useEffect(() => {
    if (session.loading) {
      return
    }
    const limit = 10
    getPlayedPodcastEpisodes(limit).then((data) => {
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

  return (
    <div className="profile-history-page-container">
      <h2 className="profile-history-page-title">Profile History</h2>
      <h3 className="profile-history-page-title">Podcast Listen History</h3>
      <LoadingDisplay loading={loading}>
        <PodcastEpisodeHistory
          IMAGE_LAZY_LOAD_START_INDEX={IMAGE_LAZY_LOAD_START_INDEX}
          episodes={episodes}
          onDelete={handlePodcastEpisodeDelete}
        />
      </LoadingDisplay>
    </div>
  )
}

export default ProfileHistoryPage
