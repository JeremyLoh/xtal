import { useCallback, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { getNewReleasePodcasts } from "../../api/podcast/podcastNewRelease.ts"
import { Podcast } from "../../api/podcast/model/podcast.ts"
import { RECENT_PODCAST_LANGUAGES } from "../../api/podcast/model/podcastRecent.ts"

const AVAILABLE_LANGUAGES = Object.entries(RECENT_PODCAST_LANGUAGES)

function useNewReleasePodcasts() {
  const abortController = useRef<AbortController | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [newReleasePodcasts, setNewReleasePodcasts] = useState<
    Podcast[] | null
  >(null)

  const getNewReleases = useCallback(
    async ({ limit, language }: { limit: number; language?: string }) => {
      setLoading(true)
      abortController.current?.abort()
      abortController.current = new AbortController()
      const params = { limit, ...(language && { lang: language }) }
      try {
        const newReleasePodcasts = await getNewReleasePodcasts(
          abortController.current,
          params
        )
        if (newReleasePodcasts) {
          setNewReleasePodcasts(newReleasePodcasts)
        }
        return newReleasePodcasts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const output = useMemo(() => {
    return { loading, AVAILABLE_LANGUAGES, newReleasePodcasts, getNewReleases }
  }, [loading, newReleasePodcasts, getNewReleases])

  return output
}

export default useNewReleasePodcasts
