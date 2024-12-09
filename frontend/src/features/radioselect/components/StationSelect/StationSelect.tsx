import "./StationSelect.css"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { motion } from "motion/react"
import { toast } from "sonner"
import { IoIosRadio } from "react-icons/io"
import { IoAddSharp } from "react-icons/io5"
import Drawer from "../../../../components/Drawer/Drawer"
import StationSearchForm from "../StationSearchForm/StationSearchForm"
import { SearchStrategyFactory } from "../../../../api/radiobrowser/searchStrategy/SearchStrategyFactory"
import { AdvancedStationSearchStrategy } from "../../../../api/radiobrowser/searchStrategy/AdvancedStationSearchStrategy"
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
  const [searchStrategy, setSearchStrategy] =
    useState<AdvancedStationSearchStrategy | null>(null)
  const [hasNoFurtherEntries, setHasNoFurtherEntries] = useState<boolean>(false)

  function handleLoadStation(station: Station) {
    props.setOpen(false)
    props.handleLoadStation(station)
  }
  async function handleNewStationSearch(data: {
    stationName: string
    limit: number
    offset: number
  }) {
    setStations(null)
    await handleStationSearch(data)
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
    setStations((previousStations) =>
      previousStations == null || stations == null
        ? stations
        : [...previousStations, ...stations]
    )
    setSearchStrategy(strategy)
    if (stations && stations.length === 0) {
      toast.warning("No stations found")
    }
    setHasNoFurtherEntries(stations == null || stations.length === 0)
  }
  async function handleLoadMoreResults() {
    if (searchStrategy == null) {
      return
    }
    await handleStationSearch({
      stationName: searchStrategy.searchCriteria.name,
      limit: searchStrategy.limit,
      offset: searchStrategy.offset + searchStrategy.limit,
    })
  }
  return (
    <Drawer title="Station Search" open={props.open} setOpen={props.setOpen}>
      <StationSearchForm handleStationSearch={handleNewStationSearch} />
      {stations && (
        <>
          <div className="station-search-result-container">
            {stations.map((station: Station, index: number) => {
              return (
                <motion.div
                  key={station.stationuuid + "-" + index}
                  className="station-search-result-card"
                  whileHover={{ scale: 1.03 }}
                >
                  <StationCard station={station}>
                    <StationCard.Icon />
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
          {stations.length > 0 && (
            <button
              className="station-search-load-more-results-button"
              onClick={handleLoadMoreResults}
              disabled={hasNoFurtherEntries}
            >
              <IoAddSharp size={24} />
              Load More Results
            </button>
          )}
        </>
      )}
    </Drawer>
  )
}

export default StationSelect
