import { createContext, useMemo, useState } from "react"
import { PodcastEpisode } from "../../api/podcast/model/podcast.ts"

type PodcastEpisodeDispatch = {
  setEpisode: React.Dispatch<React.SetStateAction<PodcastEpisode | null>>
}
type PodcastEpisodeInfo = {
  episode: PodcastEpisode | null
}

type PodcastEpisodeTimestamp = {
  lastPlayedTimestamp: number
}
type PodcastEpisodeTimestampDispatch = {
  setLastPlayedTimestamp: React.Dispatch<React.SetStateAction<number>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const PodcastEpisodeContext = createContext<PodcastEpisodeInfo | null>(
  null
)
// eslint-disable-next-line react-refresh/only-export-components
export const PodcastEpisodeDispatchContext =
  createContext<PodcastEpisodeDispatch | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export const PodcastEpisodeTimestampContext =
  createContext<PodcastEpisodeTimestamp | null>(null)
// eslint-disable-next-line react-refresh/only-export-components
export const PodcastEpisodeTimestampDispatchContext =
  createContext<PodcastEpisodeTimestampDispatch | null>(null)

type PodcastEpisodeProviderProps = {
  children: React.ReactNode
}

export default function PodcastEpisodeProvider({
  children,
}: Readonly<PodcastEpisodeProviderProps>) {
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null)
  const [lastPlayedTimestamp, setLastPlayedTimestamp] = useState<number>(0)

  const value: PodcastEpisodeInfo = useMemo(() => {
    return { episode }
  }, [episode])

  const setEpisodeValue: PodcastEpisodeDispatch = useMemo(() => {
    return { setEpisode }
  }, [])

  const timestampValue: PodcastEpisodeTimestamp = useMemo(() => {
    return { lastPlayedTimestamp }
  }, [lastPlayedTimestamp])

  const setTimestampValue: PodcastEpisodeTimestampDispatch = useMemo(() => {
    return { setLastPlayedTimestamp }
  }, [])

  return (
    <PodcastEpisodeContext.Provider value={value}>
      <PodcastEpisodeDispatchContext.Provider value={setEpisodeValue}>
        <PodcastEpisodeTimestampContext.Provider value={timestampValue}>
          <PodcastEpisodeTimestampDispatchContext.Provider
            value={setTimestampValue}
          >
            {children}
          </PodcastEpisodeTimestampDispatchContext.Provider>
        </PodcastEpisodeTimestampContext.Provider>
      </PodcastEpisodeDispatchContext.Provider>
    </PodcastEpisodeContext.Provider>
  )
}
