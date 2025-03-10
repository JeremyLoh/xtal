import { FunctionComponent, lazy } from "react"
import PodcastEpisodeCard, {
  PodcastEpisodeCardProps,
} from "./PodcastEpisodeCard.tsx"
import { ArtworkProps } from "./Artwork.tsx"
import { TitleProps } from "./Title.tsx"
import { DescriptionProps } from "./Description.tsx"
import { PlayButtonProps } from "./PlayButton.tsx"

const Artwork = lazy(() => import("./Artwork.tsx"))
const Title = lazy(() => import("./Title.tsx"))
const Description = lazy(() => import("./Description.tsx"))
const EpisodeNumber = lazy(() => import("./EpisodeNumber.tsx"))
const SeasonNumber = lazy(() => import("./SeasonNumber.tsx"))
const PlayButton = lazy(() => import("./PlayButton.tsx"))
const PublishDate = lazy(() => import("./PublishDate.tsx"))
const Duration = lazy(() => import("./Duration.tsx"))
const ExplicitIndicator = lazy(() => import("./ExplicitIndicator.tsx"))
const EpisodeWebsiteLink = lazy(() => import("./EpisodeWebsiteLink.tsx"))

type PodcastEpisodeCardCompoundComponents = {
  Artwork: FunctionComponent<ArtworkProps>
  Title: FunctionComponent<TitleProps>
  Description: FunctionComponent<DescriptionProps>
  EpisodeNumber: FunctionComponent<object>
  SeasonNumber: FunctionComponent<object>
  PlayButton: FunctionComponent<PlayButtonProps>
  PublishDate: FunctionComponent<object>
  Duration: FunctionComponent<object>
  ExplicitIndicator: FunctionComponent<object>
  EpisodeWebsiteLink: FunctionComponent<object>
}

// @ts-expect-error PodcastEpisodeCardCompoundComponents property will be defined later on
const PodcastEpisodeCardAll: FunctionComponent<PodcastEpisodeCardProps> &
  PodcastEpisodeCardCompoundComponents = PodcastEpisodeCard
PodcastEpisodeCardAll.Artwork = Artwork
PodcastEpisodeCardAll.Title = Title
PodcastEpisodeCardAll.Description = Description
PodcastEpisodeCardAll.EpisodeNumber = EpisodeNumber
PodcastEpisodeCardAll.SeasonNumber = SeasonNumber
PodcastEpisodeCardAll.PlayButton = PlayButton
PodcastEpisodeCardAll.PublishDate = PublishDate
PodcastEpisodeCardAll.Duration = Duration
PodcastEpisodeCardAll.ExplicitIndicator = ExplicitIndicator
PodcastEpisodeCardAll.EpisodeWebsiteLink = EpisodeWebsiteLink

export default PodcastEpisodeCardAll
