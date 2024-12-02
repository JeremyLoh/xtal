import { useState } from "react"
import "./StationSearch.css"
import { FaFlag, FaMusic } from "react-icons/fa"

// eslint-disable-next-line react-refresh/only-export-components
export enum StationSearchType {
  GENRE = "genre",
  COUNTRY = "country",
}

type StationSearchProps = {
  handleStationSearchType: (searchType: StationSearchType) => void
}

function StationSearch(props: StationSearchProps) {
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
    </div>
  )
}

export default StationSearch
