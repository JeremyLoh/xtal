import { useState } from "react"
import "./StationSearch.css"
import { FaFlag, FaMusic, FaSearch } from "react-icons/fa"
import { StationSearchType } from "../../../../api/radiobrowser/searchStrategy/SearchStrategyFactory"
import StationSelect from "../StationSelect/StationSelect"

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
        className={`search-filter-button ${showSearchFilter ? "selected" : ""}`}
        name="search radio stations with more filters"
        title="Search Radio Stations with more filters"
      >
        <FaSearch size={16} /> Search Filters
      </button>
      <StationSelect open={showSearchFilter} setOpen={setShowSearchFilter} />
    </div>
  )
}

export default StationSearch
