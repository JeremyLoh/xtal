import "./StationSelect.css"
import { motion } from "motion/react"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import Drawer from "../../../../components/Drawer/Drawer"
import StationSearchForm from "../StationSearchForm/StationSearchForm"
import { SearchStrategyFactory } from "../../../../api/radiobrowser/searchStrategy/SearchStrategyFactory"
import { Station } from "../../../../api/radiobrowser/types"
import Pill from "../../../../components/Pill/Pill"

type StationSelectProps = {
  handleLoadStation: (station: Station) => void
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

function StationSelect(props: StationSelectProps) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [stations, setStations] = useState<Station[] | null>(null)

  function handleLoadStation(station: Station) {
    props.setOpen(false)
    props.handleLoadStation(station)
  }
  async function handleStationSearch({
    stationName,
    limit,
    offset,
  }: {
    stationName: string
    limit: number
    offset: number
  }) {
    abortControllerRef?.current?.abort()
    abortControllerRef.current = new AbortController()
    const strategy = SearchStrategyFactory.createAdvancedSearchStrategy(
      {
        name: stationName,
      },
      limit,
      offset
    )
    const stations = await strategy.findStations(abortControllerRef.current)
    setStations(stations)
  }
  return (
    <Drawer title="Station Search" open={props.open} setOpen={props.setOpen}>
      <StationSearchForm handleStationSearch={handleStationSearch} />
      {stations && (
        <div className="station-search-result-container">
          {stations.map((station: Station) => {
            return (
              <motion.div
                key={station.stationuuid}
                className="station-search-result-card"
                whileHover={{ scale: 1.04 }}
              >
                <p className="station-search-card-title">{station.name}</p>
                {station.bitrate > 0 ? (
                  <Pill
                    className="station-search-card-bitrate-pill"
                    key="station-bitrate"
                  >
                    {station.bitrate} kbps
                  </Pill>
                ) : (
                  <Pill
                    className="station-search-card-bitrate-pill"
                    key="station-bitrate"
                  >
                    Unknown kbps
                  </Pill>
                )}
                {station.tags != "" && station.tags.split(",").length > 0 && (
                  <div className="station-search-card-tag-container">
                    {station.tags.split(",").map((tag, index) => (
                      <Pill key={`${tag}-${index}`}>{tag}</Pill>
                    ))}
                  </div>
                )}
                {station.country && (
                  <p className="station-search-card-country">
                    {station.country}
                  </p>
                )}
                <button
                  className="station-search-card-load-button"
                  onClick={() => handleLoadStation(station)}
                >
                  Load Station
                </button>
              </motion.div>
            )
          })}
        </div>
      )}
    </Drawer>
  )
}

export default StationSelect
