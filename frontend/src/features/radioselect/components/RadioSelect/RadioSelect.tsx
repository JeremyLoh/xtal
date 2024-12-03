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
import { CountryStationSearchStrategy } from "../../../../api/radiobrowser/searchStrategy/CountryStationSearchStrategy"
import StationSearch, {
  StationSearchType,
} from "../StationSearch/StationSearch"
import CountrySelect from "../CountrySelect/CountrySelect"
import {
  CountryStation,
  DEFAULT_COUNTRY_SEARCH,
} from "../../../../api/location/countryStation"

type RadioSelectProps = {
  handleRandomSelect: (searchStrategy: StationSearchStrategy) => void
  isLoading: boolean
}

type ActiveSearch = {
  type: StationSearchType
  strategy: StationSearchStrategy
}

const defaultSearchTypes = new Map<StationSearchType, ActiveSearch>([
  [
    StationSearchType.GENRE,
    {
      type: StationSearchType.GENRE,
      strategy: getGenreStationSearchStrategy(DEFAULT_GENRE_SEARCH),
    },
  ],
  [
    StationSearchType.COUNTRY,
    {
      type: StationSearchType.COUNTRY,
      strategy: new CountryStationSearchStrategy(DEFAULT_COUNTRY_SEARCH),
    },
  ],
])

function RadioSelect(props: RadioSelectProps) {
  const [activeSearch, setActiveSearch] = useState<ActiveSearch | undefined>(
    defaultSearchTypes.get(StationSearchType.GENRE)
  )
  function handleStationSearchType(searchType: StationSearchType) {
    if (activeSearch && searchType === activeSearch.type) {
      return
    }
    if (defaultSearchTypes.has(searchType)) {
      setActiveSearch(defaultSearchTypes.get(searchType))
    }
  }

  function handleGenreSelect(genre: GenreInformation) {
    setActiveSearch({
      type: StationSearchType.GENRE,
      strategy: getGenreStationSearchStrategy(genre),
    })
  }
  function handleCountrySelect(country: CountryStation) {
    setActiveSearch({
      type: StationSearchType.COUNTRY,
      strategy: new CountryStationSearchStrategy(country),
    })
  }
  return (
    <div className="radio-select-container">
      <StationSearch handleStationSearchType={handleStationSearchType} />
      {activeSearch && activeSearch.type === StationSearchType.GENRE && (
        <GenreSelect handleGenreSelect={handleGenreSelect} />
      )}
      {activeSearch && activeSearch.type === StationSearchType.COUNTRY && (
        <CountrySelect handleCountrySelect={handleCountrySelect} />
      )}
      <button
        className="radio-select-random-btn"
        disabled={props.isLoading}
        onClick={() =>
          activeSearch && props.handleRandomSelect(activeSearch.strategy)
        }
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
