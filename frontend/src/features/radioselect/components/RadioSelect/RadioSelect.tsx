import "./RadioSelect.css"
import { useState } from "react"
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi"
import GenreSelect from "../GenreSelect/GenreSelect"
import {
  DEFAULT_GENRE_SEARCH,
  GenreInformation,
} from "../../../../api/radiobrowser/genreTags"
import { StationSearchStrategy } from "../../../../api/radiobrowser/searchStrategy/StationSearchStrategy"
import { getGenreStationSearchStrategy } from "../../../../api/radiobrowser/searchStrategy/GenreStationSearchStrategy"
import StationSearch, {
  StationSearchType,
} from "../StationSearch/StationSearch"
import CountrySelect from "../CountrySelect/CountrySelect"
import { CountryStation } from "../../../../api/location/countryStation"

type RadioSelectProps = {
  handleRandomSelect: (searchStrategy: StationSearchStrategy) => void
  isLoading: boolean
}

type ActiveSearch = {
  type: StationSearchType
  strategy: StationSearchStrategy
}

function RadioSelect(props: RadioSelectProps) {
  const [activeSearch, setActiveSearch] = useState<ActiveSearch>({
    type: StationSearchType.GENRE,
    strategy: getGenreStationSearchStrategy(DEFAULT_GENRE_SEARCH),
  })
  function handleStationSearchType(searchType: StationSearchType) {
    if (searchType === activeSearch.type) {
      return
    }
    setActiveSearch({
      type: searchType,
      strategy: getGenreStationSearchStrategy(DEFAULT_GENRE_SEARCH),
    })
  }

  function handleGenreSelect(genre: GenreInformation) {
    setActiveSearch({
      type: StationSearchType.GENRE,
      strategy: getGenreStationSearchStrategy(genre),
    })
  }
  function handleCountrySelect(country: CountryStation) {
    // TODO setActiveSearch for the country, create countrySearchStrategy
    console.log({ country })
  }
  return (
    <div className="radio-select-container">
      <StationSearch handleStationSearchType={handleStationSearchType} />
      {activeSearch.type === StationSearchType.GENRE && (
        <GenreSelect handleGenreSelect={handleGenreSelect} />
      )}
      {activeSearch.type === StationSearchType.COUNTRY && (
        <CountrySelect handleCountrySelect={handleCountrySelect} />
      )}
      <button
        className="radio-select-random-btn"
        disabled={props.isLoading}
        onClick={() => props.handleRandomSelect(activeSearch.strategy)}
        data-testid="random-radio-station-btn"
      >
        <GiPerspectiveDiceSixFacesRandom
          size={36}
          title="Select a random radio station"
        />
        <span>Random</span>
      </button>
    </div>
  )
}

export default RadioSelect
