import { FunctionComponent, lazy } from "react"
import { PodcastCardProps } from "./PodcastCard.tsx"
import { ArtworkProps } from "./Artwork.tsx"
import { TitleAndAuthorProps } from "./TitleAndAuthor.tsx"
import { PodcastCardFollowButtonProps } from "./FollowButton.tsx"
import { PodcastCardShareButtonProps } from "./ShareButton.tsx"
import { PodcastCardLastActiveTimeProps } from "./LastActiveTime.tsx"

const PodcastCard = lazy(() => import("./PodcastCard.tsx"))
const Artwork = lazy(() => import("./Artwork.tsx"))
const TitleAndAuthor = lazy(() => import("./TitleAndAuthor.tsx"))
const EpisodeCount = lazy(() => import("./EpisodeCount.tsx"))
const Language = lazy(() => import("./Language.tsx"))
const Categories = lazy(() => import("./Categories.tsx"))
const FollowButton = lazy(() => import("./FollowButton.tsx"))
const ShareButton = lazy(() => import("./ShareButton.tsx"))
const LastActiveTime = lazy(() => import("./LastActiveTime.tsx"))

type PodcastCardCompoundComponents = {
  Artwork: FunctionComponent<ArtworkProps>
  TitleAndAuthor: FunctionComponent<TitleAndAuthorProps>
  EpisodeCount: FunctionComponent<object>
  Language: FunctionComponent<object>
  Categories: FunctionComponent<object>
  FollowButton: FunctionComponent<PodcastCardFollowButtonProps>
  ShareButton: FunctionComponent<PodcastCardShareButtonProps>
  LastActiveTime: FunctionComponent<PodcastCardLastActiveTimeProps>
}

// https://stackoverflow.com/questions/63136659/property-does-not-exist-in-a-functional-component-with-added-functional-compon
// @ts-expect-error PodcastCardCompoundComponents property will be defined later on
const PodcastCardAll: FunctionComponent<PodcastCardProps> &
  PodcastCardCompoundComponents = PodcastCard
PodcastCardAll.Artwork = Artwork
PodcastCardAll.TitleAndAuthor = TitleAndAuthor
PodcastCardAll.EpisodeCount = EpisodeCount
PodcastCardAll.Language = Language
PodcastCardAll.Categories = Categories
PodcastCardAll.FollowButton = FollowButton
PodcastCardAll.ShareButton = ShareButton
PodcastCardAll.LastActiveTime = LastActiveTime

export default PodcastCardAll
