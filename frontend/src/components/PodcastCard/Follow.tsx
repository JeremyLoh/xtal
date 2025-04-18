import { toast } from "sonner"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useSessionContext } from "supertokens-auth-react/recipe/session"
import { usePodcastCardContext } from "./PodcastCardContext.ts"
import Button from "../ui/button/Button.tsx"
import {
  addPodcastFollow,
  getPodcastFollowStatusById,
} from "../../api/podcast/podcastFollow.ts"

const Follow = function PodcastCardFollowButton() {
  const { podcast } = usePodcastCardContext()
  const session = useSessionContext()
  const [followed, setFollowed] = useState<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // check if user has followed the podcast, skip check if followed = true
    if (session.loading || podcast == null || followed) {
      return
    }
    if (!session.doesSessionExist) {
      return
    }
    abortControllerRef?.current?.abort()
    abortControllerRef.current = new AbortController()
    getPodcastFollowStatusById(abortControllerRef.current, `${podcast.id}`)
      .then((isFollowing) => {
        if (isFollowing == null) {
          return
        }
        setFollowed(isFollowing)
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }, [podcast, session, followed])

  const handleUserPodcastFollow = useCallback(async () => {
    try {
      abortControllerRef?.current?.abort()
      abortControllerRef.current = new AbortController()
      await addPodcastFollow(abortControllerRef.current, podcast)
      setFollowed(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [podcast])

  if (session.loading || !session.doesSessionExist) {
    return null
  }
  return followed ? (
    <Button variant="secondary">Followed</Button>
  ) : (
    <Button
      variant="primary"
      onClick={handleUserPodcastFollow}
      title="Follow Podcast"
    >
      Follow
    </Button>
  )
}

export default memo(Follow)
