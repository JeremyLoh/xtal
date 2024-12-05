import { useState } from "react"
import "./StationSearch.css"
import { FaFlag, FaMusic, FaSearch } from "react-icons/fa"
import { StationSearchType } from "../../../../api/radiobrowser/searchStrategy/SearchStrategyFactory"
import Drawer from "../../../../components/Drawer/Drawer"

type StationSearchProps = {
  handleStationSearchType: (searchType: StationSearchType) => void
}

function StationSearch(props: StationSearchProps) {
  const [showSearchFilter, setShowSearchFilter] = useState<boolean>(false)
  const [selectedSearch, setSelectedSearch] = useState<StationSearchType>(
    StationSearchType.GENRE
  )
  function handleClick(searchType: StationSearchType) {
    setSelectedSearch(searchType)
    props.handleStationSearchType(searchType)
  }
  return (
    <div id="station-search-type-container">
      <button
        className={`genre-search-button ${
          selectedSearch === StationSearchType.GENRE ? "selected" : ""
        }`}
        onClick={() => handleClick(StationSearchType.GENRE)}
      >
        <FaMusic size={16} /> Genres
      </button>
      <button
        className={`country-search-button ${
          selectedSearch === StationSearchType.COUNTRY ? "selected" : ""
        }`}
        onClick={() => handleClick(StationSearchType.COUNTRY)}
      >
        <FaFlag size={16} /> Countries
      </button>
      <button
        onClick={() => setShowSearchFilter(!showSearchFilter)}
        className="search-filter-button"
        name="search radio stations with more filters"
        title="Search Radio Stations with more filters"
      >
        <FaSearch size={16} /> Search Filters
      </button>
      <Drawer open={showSearchFilter} setOpen={setShowSearchFilter}></Drawer>
    </div>
  )
}

export default StationSearch
