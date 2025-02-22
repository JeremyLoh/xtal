import "./StationCard.css"
import { createContext, PropsWithChildren, useContext } from "react"
import { FaMapMarkerAlt } from "react-icons/fa"
import { BiSolidLike } from "react-icons/bi"
import { IoLanguageSharp, IoShareSocialSharp } from "react-icons/io5"
import { GoStar, GoStarFill } from "react-icons/go"
import { MdOutlineImageNotSupported } from "react-icons/md"
import { Station } from "../../api/radiobrowser/types.ts"
import Pill from "../Pill/Pill.tsx"

type StationCardContext = {
  station: Station
}

type StationCardProps = PropsWithChildren & {
  station: Station
}

const StationCardContext = createContext<StationCardContext | null>(null)

function useStationCardContext() {
  const context = useContext(StationCardContext)
  if (!context) {
    throw new Error("useStationCardContext must be used within a StationCard")
  }
  return context
}

export default function StationCard({ children, station }: StationCardProps) {
  return (
    <StationCardContext.Provider value={{ station }}>
      <div className="station-card">{children}</div>
    </StationCardContext.Provider>
  )
}

StationCard.Icon = function StationCardIcon() {
  const { station } = useStationCardContext()
  return station.favicon ? (
    <img
      className="station-card-icon"
      src={station.favicon}
      height={64}
      width={64}
    />
  ) : (
    <MdOutlineImageNotSupported
      className="station-card-icon"
      size={64}
      title="Icon Not Available"
    />
  )
}

StationCard.Title = function StationCardTitle() {
  const { station } = useStationCardContext()
  return <h2 className="station-card-title">{station.name}</h2>
}

StationCard.FavouriteIconOutline = function StationCardFavouriteIconOutline() {
  return <GoStar size={20} className="station-card-favourite-icon" />
}
StationCard.FavouriteIconFilled = function StationCardFavouriteIconFilled() {
  return (
    <GoStarFill
      size={20}
      color="#facc15"
      className="station-card-favourite-icon selected"
    />
  )
}

StationCard.ShareIcon = function StationCardShareIcon() {
  return <IoShareSocialSharp size={20} className="station-card-share-icon" />
}

StationCard.Bitrate = function StationCardBitrate() {
  const { station } = useStationCardContext()
  return station.bitrate > 0 ? (
    <Pill className="station-card-bitrate-pill" key="station-bitrate">
      {station.bitrate} kbps
    </Pill>
  ) : (
    <Pill className="station-card-bitrate-pill" key="station-bitrate">
      Unknown kbps
    </Pill>
  )
}

StationCard.Tags = function StationCardTags() {
  const { station } = useStationCardContext()
  return (
    station.tags != "" &&
    station.tags.split(",").length > 0 && (
      <div className="station-card-tag-container">
        {station.tags.split(",").map((tag, index) => (
          <Pill key={`${tag}-${index}`}>{tag}</Pill>
        ))}
      </div>
    )
  )
}

StationCard.Country = function StationCardCountry() {
  const { station } = useStationCardContext()
  return (
    station.country && (
      <p className="station-card-country">
        <FaMapMarkerAlt size={15} />
        {station.country}
      </p>
    )
  )
}

StationCard.HomepageLink = function StationCardHomepageLink() {
  const { station } = useStationCardContext()
  return (
    station.homepage && (
      <a
        className="station-card-homepage"
        href={station.homepage}
        rel="noopener noreferrer"
        target="_blank"
      >
        {station.homepage}
      </a>
    )
  )
}

StationCard.Votes = function StationCardVotes() {
  const { station } = useStationCardContext()
  return (
    station.votes > 0 && (
      <Pill className="station-card-vote-pill" key="station-votes">
        <BiSolidLike size={18} aria-label="Station Vote Count" />{" "}
        {station.votes}
      </Pill>
    )
  )
}

StationCard.Language = function StationCardLanguage() {
  const { station } = useStationCardContext()
  return (
    station.language &&
    station.language !== "" && (
      <Pill className="station-card-language-pill" key="station-language">
        <IoLanguageSharp size={18} />
        {station.language}
      </Pill>
    )
  )
}
