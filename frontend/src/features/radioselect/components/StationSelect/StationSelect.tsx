import { Dispatch, SetStateAction, useRef } from "react"
import Drawer from "../../../../components/Drawer/Drawer"
import StationSearchForm from "../StationSearchForm/StationSearchForm"
import { SearchStrategyFactory } from "../../../../api/radiobrowser/searchStrategy/SearchStrategyFactory"

type StationSelectProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

function StationSelect(props: StationSelectProps) {
  const abortControllerRef = useRef<AbortController | null>(null)

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
    if (strategy) {
      const stations = await strategy.findStations(abortControllerRef.current)
      // TODO search and display list of results
      console.log({ stations })
    }
  }
  return (
    <Drawer title="Station Search" open={props.open} setOpen={props.setOpen}>
      <StationSearchForm handleStationSearch={handleStationSearch} />
    </Drawer>
  )
}

export default StationSelect
