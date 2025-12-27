import "./StationSelect.css"
import { memo, useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner"
import { IoIosRadio } from "react-icons/io"
import { IoAddSharp } from "react-icons/io5"
import Drawer from "../../../../components/Drawer/Drawer.tsx"
import StationSearchForm, {
  StationSearchValues,
} from "../StationSearchForm/StationSearchForm.tsx"
import { SearchStrategyFactory } from "../../../../api/radiobrowser/searchStrategy/SearchStrategyFactory.ts"
import { AdvancedStationSearchStrategy } from "../../../../api/radiobrowser/searchStrategy/AdvancedStationSearchStrategy.ts"
import Button from "../../../../components/ui/button/Button.tsx"
import { Station } from "../../../../api/radiobrowser/types.ts"
import StationCard from "../../../../components/StationCard/index.tsx"

type StationSelectProps = {
  onLoadStation: (station: Station) => void
  open: boolean
  setOpen: (isOpen: boolean) => void
}

const motionInitial = { opacity: 0, x: 100 }
const motionAnimate = { opacity: 1, x: 0 }
const motionTransition = { duration: 0.3, type: "spring", bounce: 0 }

function StationSelect({
  onLoadStation,
  open,
  setOpen,
}: Readonly<StationSelectProps>) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [stations, setStations] = useState<Station[] | null>(null)
  const [searchStrategy, setSearchStrategy] =
    useState<AdvancedStationSearchStrategy | null>(null)
  const [hasNoFurtherEntries, setHasNoFurtherEntries] = useState<boolean>(false)

  function handleLoadStation(station: Station) {
    setOpen(false)
    onLoadStation(station)
  }
  const handleStationSearch = useCallback(
    async ({
      stationName,
      language,
      sort,
      tag,
      limit,
      offset,
    }: StationSearchValues) => {
      abortControllerRef?.current?.abort()
      abortControllerRef.current = new AbortController()
      const strategy = SearchStrategyFactory.createAdvancedSearchStrategy(
        {
          name: stationName,
          language: language,
          sort: sort,
          tag: tag,
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
      if (stations?.length === 0) {
        toast.warning("No stations found")
      }
      setHasNoFurtherEntries(stations == null || stations.length === 0)
    },
    []
  )
  const handleNewStationSearch = useCallback(
    async (data: StationSearchValues) => {
      setStations(null)
      await handleStationSearch(data)
    },
    [handleStationSearch]
  )
  const handleLoadMoreResults = useCallback(async () => {
    if (searchStrategy == null) {
      return
    }
    await handleStationSearch({
      stationName: searchStrategy.searchCriteria.name,
      language: searchStrategy.searchCriteria.language,
      sort: searchStrategy.searchCriteria.sort,
      tag: searchStrategy.searchCriteria.tag,
      limit: searchStrategy.limit,
      offset: searchStrategy.offset + searchStrategy.limit,
    })
  }, [searchStrategy, handleStationSearch])
  return (
    <Drawer title="Station Search" open={open} setOpen={setOpen}>
      <StationSearchForm handleStationSearch={handleNewStationSearch} />
      {stations && (
        <>
          <div className="station-search-result-container">
            <AnimatePresence>
              {stations.map((station: Station, index: number) => {
                return (
                  <motion.div
                    key={station.stationuuid + "-" + index}
                    className="station-search-result-card"
                    initial={motionInitial}
                    animate={motionAnimate}
                    transition={motionTransition}
                  >
                    <StationCard station={station}>
                      <StationCard.Icon />
                      <StationCard.Title />
                      <StationCard.Votes />
                      <StationCard.Language />
                      <StationCard.Bitrate />
                      <StationCard.Tags />
                      <StationCard.Country />
                    </StationCard>
                    <Button
                      keyProp="station-search-card-load-button"
                      variant="secondary"
                      className="station-search-card-load-button"
                      onClick={() => handleLoadStation(station)}
                    >
                      <IoIosRadio size={24} />
                      Load Station
                    </Button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
          {stations.length > 0 && (
            <Button
              keyProp="station-search-load-more-results-button"
              variant="secondary"
              className="station-search-load-more-results-button"
              onClick={handleLoadMoreResults}
              disabled={hasNoFurtherEntries}
            >
              <IoAddSharp size={24} />
              Load More Results
            </Button>
          )}
        </>
      )}
    </Drawer>
  )
}

export default memo(StationSelect)
