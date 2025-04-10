import { useCallback, useMemo } from "react"
import {
  SessionContextType,
  useSessionContext,
} from "supertokens-auth-react/recipe/session/index"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"
import { updateAccountPodcastEpisodePlayHistory } from "../../api/podcast/history/account.ts"

function usePlayHistory() {
  const session: SessionContextType = useSessionContext()
  const addPodcastEpisode = useCallback(
    async (episode: PodcastEpisode, resumePlayTimeInSeconds: number) => {
      if (session.loading) {
        return
      }
      if (session.doesSessionExist) {
        await updateAccountPodcastEpisodePlayHistory(
          episode,
          resumePlayTimeInSeconds
        )
      }
    },
    [session]
  )
  const output = useMemo(() => {
    return { session, addPodcastEpisode }
  }, [session, addPodcastEpisode])

  return output
}

export default usePlayHistory
