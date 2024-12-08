import "./StationSelect.css"
import { motion } from "motion/react"
import { toast } from "sonner"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { IoIosRadio } from "react-icons/io"
import Drawer from "../../../../components/Drawer/Drawer"
import StationSearchForm from "../StationSearchForm/StationSearchForm"
import { SearchStrategyFactory } from "../../../../api/radiobrowser/searchStrategy/SearchStrategyFactory"
import { Station } from "../../../../api/radiobrowser/types"
import StationCard from "../../../../components/StationCard/StationCard"

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
    if (stations && stations.length === 0) {
      toast.warning("No stations found")
    }
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
                <StationCard station={station}>
                  <StationCard.Title />
                  <StationCard.Bitrate />
                  <StationCard.Tags />
                  <StationCard.Country />
                </StationCard>
                <button
                  className="station-search-card-load-button"
                  onClick={() => handleLoadStation(station)}
                >
                  <IoIosRadio size={24} />
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
