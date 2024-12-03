import "./RadioSelect.css"
import { useState } from "react"
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi"
import GenreSelect from "../GenreSelect/GenreSelect"
import { GenreInformation } from "../../../../api/radiobrowser/genreTags"
import { StationSearchStrategy } from "../../../../api/radiobrowser/searchStrategy/StationSearchStrategy"
import StationSearch from "../StationSearch/StationSearch"
import CountrySelect from "../CountrySelect/CountrySelect"
import { CountryStation } from "../../../../api/location/countryStation"
import {
  SearchStrategyFactory,
  StationSearchType,
} from "../../../../api/radiobrowser/searchStrategy/SearchStrategyFactory"

type RadioSelectProps = {
  handleRandomSelect: (searchStrategy: StationSearchStrategy) => void
  isLoading: boolean
}

type ActiveSearch = {
  type: StationSearchType
  strategy: StationSearchStrategy
}

const initialActiveSearch: ActiveSearch = {
  type: StationSearchType.GENRE,
  strategy: SearchStrategyFactory.createDefaultSearchStrategy(
    StationSearchType.GENRE
  ),
}

function RadioSelect(props: RadioSelectProps) {
  const [activeSearch, setActiveSearch] =
    useState<ActiveSearch>(initialActiveSearch)
  function handleStationSearchType(searchType: StationSearchType) {
    if (activeSearch && searchType === activeSearch.type) {
      return
    }
    setActiveSearch({
      type: searchType,
      strategy: SearchStrategyFactory.createDefaultSearchStrategy(searchType),
    })
  }

  function handleGenreSelect(genre: GenreInformation) {
    setActiveSearch({
      type: StationSearchType.GENRE,
      strategy: SearchStrategyFactory.createGenreSearchStrategy(genre),
    })
  }
  function handleCountrySelect(country: CountryStation) {
    setActiveSearch({
      type: StationSearchType.COUNTRY,
      strategy: SearchStrategyFactory.createCountrySearchStrategy(country),
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
