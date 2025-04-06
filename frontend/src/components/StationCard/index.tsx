import { FunctionComponent, lazy } from "react"
import { StationCardProps } from "./StationCard.tsx"
import FavouriteIconOutline from "./FavouriteIconOutline.tsx"
import FavouriteIconFilled from "./FavouriteIconFilled.tsx"

const StationCard = lazy(() => import("./StationCard.tsx"))
const Icon = lazy(() => import("./Icon.tsx"))
const Title = lazy(() => import("./Title.tsx"))
const ShareIcon = lazy(() => import("./ShareIcon.tsx"))
const Bitrate = lazy(() => import("./Bitrate.tsx"))
const Tags = lazy(() => import("./Tags.tsx"))
const Country = lazy(() => import("./Country.tsx"))
const HomepageLink = lazy(() => import("./HomepageLink.tsx"))
const Votes = lazy(() => import("./Votes.tsx"))
const Language = lazy(() => import("./Language.tsx"))

type StationCardCompoundComponents = {
  Icon: FunctionComponent<object>
  Title: FunctionComponent<object>
  FavouriteIconOutline: FunctionComponent<object>
  FavouriteIconFilled: FunctionComponent<object>
  ShareIcon: FunctionComponent<object>
  Bitrate: FunctionComponent<object>
  Tags: FunctionComponent<object>
  Country: FunctionComponent<object>
  HomepageLink: FunctionComponent<object>
  Votes: FunctionComponent<object>
  Language: FunctionComponent<object>
}

// @ts-expect-error StationCardCompoundComponents property will be defined later on
const StationCardAll: FunctionComponent<StationCardProps> &
  StationCardCompoundComponents = StationCard

StationCardAll.Icon = Icon
StationCardAll.Title = Title
StationCardAll.FavouriteIconOutline = FavouriteIconOutline
StationCardAll.FavouriteIconFilled = FavouriteIconFilled
StationCardAll.ShareIcon = ShareIcon
StationCardAll.Bitrate = Bitrate
StationCardAll.Tags = Tags
StationCardAll.Country = Country
StationCardAll.HomepageLink = HomepageLink
StationCardAll.Votes = Votes
StationCardAll.Language = Language

export default StationCardAll
