import { toast } from "sonner"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useSessionContext } from "supertokens-auth-react/recipe/session"
import { usePodcastCardContext } from "./PodcastCardContext.ts"
import Button from "../ui/button/Button.tsx"
import {
  addPodcastFollow,
  getPodcastFollowStatusById,
  removePodcastFollow,
} from "../../api/podcast/podcastFollow.ts"

export type PodcastCardFollowButtonProps = {
  isInitialFollowed?: boolean
}

const FollowButton = function PodcastCardFollowButton({
  isInitialFollowed,
}: PodcastCardFollowButtonProps) {
  const { podcast } = usePodcastCardContext()
  const session = useSessionContext()
  const [followed, setFollowed] = useState<boolean>(isInitialFollowed || false)
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
  }, [podcast, session, followed, isInitialFollowed])

  const handleFollowUserPodcast = useCallback(async () => {
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

  const handleUnfollowUserPodcast = useCallback(async () => {
    try {
      abortControllerRef?.current?.abort()
      abortControllerRef.current = new AbortController()
      await removePodcastFollow(abortControllerRef.current, `${podcast.id}`)
      setFollowed(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [podcast.id])

  if (session.loading || !session.doesSessionExist) {
    return null
  }
  return followed ? (
    <Button
      keyProp="followed-podcast-button"
      variant="secondary"
      onClick={handleUnfollowUserPodcast}
    >
      <b>Followed</b>
    </Button>
  ) : (
    <Button
      keyProp="follow-podcast-button"
      variant="primary"
      onClick={handleFollowUserPodcast}
      title="Follow Podcast"
    >
      <b>Follow</b>
    </Button>
  )
}

export default memo(FollowButton)
