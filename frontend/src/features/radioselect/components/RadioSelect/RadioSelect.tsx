import "./RadioSelect.css"
import { useState } from "react"
import { FaRandom } from "react-icons/fa"
import GenreSelect from "../GenreSelect/GenreSelect.tsx"
import StationSearch from "../StationSearch/StationSearch.tsx"
import CountrySelect from "../CountrySelect/CountrySelect.tsx"
import { GenreInformation } from "../../../../api/radiobrowser/genreTags.ts"
import {
  CountryStation,
  DEFAULT_COUNTRY_SEARCH,
} from "../../../../api/location/countryStation.ts"
import { StationSearchStrategy } from "../../../../api/radiobrowser/searchStrategy/StationSearchStrategy.ts"
import {
  SearchStrategyFactory,
  StationSearchType,
} from "../../../../api/radiobrowser/searchStrategy/SearchStrategyFactory.ts"

type RadioSelectProps = {
  handleRandomSelect: (searchStrategy: StationSearchStrategy) => void
  handleCountryChange: (countryCode: string) => void
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
    if (searchType === StationSearchType.COUNTRY) {
      // load default country for first time switching to country search type
      props.handleCountryChange(DEFAULT_COUNTRY_SEARCH.countryCode)
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
    props.handleCountryChange(country.countryCode)
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
        <FaRandom
          size={window.innerWidth < 500 ? 16 : 20}
          title="Select a random radio station"
        />
        <b>Random</b>
      </button>
    </div>
  )
}

export default RadioSelect
