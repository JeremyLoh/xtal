import { useStationCardContext } from "./StationCardContext.ts"

const HomepageLink = function StationCardHomepageLink() {
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

export default HomepageLink
