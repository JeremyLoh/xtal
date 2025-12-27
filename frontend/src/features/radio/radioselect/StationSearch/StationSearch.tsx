import "./StationSearch.css"
import { useCallback, useContext, useState } from "react"
import { FaFlag, FaMusic, FaSearch } from "react-icons/fa"
import { StationSearchType } from "../../../../api/radiobrowser/searchStrategy/SearchStrategyFactory.ts"
import StationSelect from "../StationSelect/StationSelect.tsx"
import { Station } from "../../../../api/radiobrowser/types.ts"
import Button from "../../../../components/ui/button/Button.tsx"
import { MapContext } from "../../../../context/MapProvider/MapProvider.tsx"

type StationSearchProps = {
  onStationSearchTypeSelect: (searchType: StationSearchType) => void
}

function StationSearch({
  onStationSearchTypeSelect,
}: Readonly<StationSearchProps>) {
  const mapContext = useContext(MapContext)
  const [showSearchStation, setShowSearchStation] = useState<boolean>(false)
  const [selectedSearch, setSelectedSearch] = useState<StationSearchType>(
    StationSearchType.GENRE
  )
  function handleClick(searchType: StationSearchType) {
    setSelectedSearch(searchType)
    onStationSearchTypeSelect(searchType)
  }
  const handleAdvancedClick = useCallback(() => {
    setSelectedSearch(StationSearchType.ADVANCED)
    setShowSearchStation(!showSearchStation)
  }, [showSearchStation])
  const handleLoadStation = useCallback(
    (station: Station) => {
      mapContext?.setStation(station)
    },
    [mapContext]
  )
  const handleOpen = useCallback(
    (isOpen: boolean) => {
      setShowSearchStation(isOpen)
      if (!isOpen) {
        // revert back to default first station search type
        setSelectedSearch(StationSearchType.GENRE)
        onStationSearchTypeSelect(StationSearchType.GENRE)
      }
    },
    [onStationSearchTypeSelect]
  )
  return (
    <div id="station-search-type-container">
      <Button
        keyProp="genre-search-button"
        className={`genre-search-button ${
          selectedSearch === StationSearchType.GENRE ? "selected" : ""
        }`}
        onClick={() => handleClick(StationSearchType.GENRE)}
      >
        <FaMusic size={16} /> Genres
      </Button>
      <Button
        keyProp="country-search-button"
        className={`country-search-button ${
          selectedSearch === StationSearchType.COUNTRY ? "selected" : ""
        }`}
        onClick={() => handleClick(StationSearchType.COUNTRY)}
      >
        <FaFlag size={16} /> Countries
      </Button>
      <Button
        keyProp="search-station-button"
        onClick={handleAdvancedClick}
        className={`search-station-button ${
          showSearchStation ? "selected" : ""
        }`}
        name="search radio stations with more filters"
        title="Search Radio Stations with more filters"
      >
        <FaSearch size={16} /> Search Stations
      </Button>
      <StationSelect
        onLoadStation={handleLoadStation}
        open={showSearchStation}
        setOpen={handleOpen}
      />
    </div>
  )
}

export default StationSearch
