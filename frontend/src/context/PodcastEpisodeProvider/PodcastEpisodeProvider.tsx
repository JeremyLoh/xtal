import { createContext, useMemo, useState } from "react"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"

type PodcastEpisodeInfo = {
  episode: PodcastEpisode | null
  setEpisode: React.Dispatch<React.SetStateAction<PodcastEpisode | null>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const PodcastEpisodeContext = createContext<PodcastEpisodeInfo | null>(
  null
)

export default function PodcastEpisodeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null)
  const value: PodcastEpisodeInfo = useMemo(() => {
    return { episode, setEpisode }
  }, [episode])
  return (
    <PodcastEpisodeContext.Provider value={value}>
      {children}
    </PodcastEpisodeContext.Provider>
  )
}
