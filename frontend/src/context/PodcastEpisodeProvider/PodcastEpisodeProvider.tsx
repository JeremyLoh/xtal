import { createContext, useMemo, useState } from "react"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"

type PodcastEpisodeDispatch = {
  setEpisode: React.Dispatch<React.SetStateAction<PodcastEpisode | null>>
}

type PodcastEpisodeInfo = {
  episode: PodcastEpisode | null
  lastPlayedTimestamp: number
  setLastPlayedTimestamp: React.Dispatch<React.SetStateAction<number>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const PodcastEpisodeContext = createContext<PodcastEpisodeInfo | null>(
  null
)

// eslint-disable-next-line react-refresh/only-export-components
export const PodcastEpisodeDispatchContext =
  createContext<PodcastEpisodeDispatch | null>(null)

export default function PodcastEpisodeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null)
  const [lastPlayedTimestamp, setLastPlayedTimestamp] = useState<number>(0)

  const value: PodcastEpisodeInfo = useMemo(() => {
    return { episode, lastPlayedTimestamp, setLastPlayedTimestamp }
  }, [episode, lastPlayedTimestamp])

  const setEpisodeValue: PodcastEpisodeDispatch = useMemo(() => {
    return { setEpisode }
  }, [])

  return (
    <PodcastEpisodeContext.Provider value={value}>
      <PodcastEpisodeDispatchContext.Provider value={setEpisodeValue}>
        {children}
      </PodcastEpisodeDispatchContext.Provider>
    </PodcastEpisodeContext.Provider>
  )
}
