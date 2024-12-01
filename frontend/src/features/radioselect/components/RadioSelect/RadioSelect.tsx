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

type RadioSelectProps = {
  handleRandomSelect: (searchStrategy: StationSearchStrategy) => void
  isLoading: boolean
}

function RadioSelect(props: RadioSelectProps) {
  const [selectedGenre, setSelectedGenre] =
    useState<GenreInformation>(DEFAULT_GENRE_SEARCH)
  function handleGenreSelect(genre: GenreInformation) {
    setSelectedGenre(genre)
  }
  return (
    <div className="radio-select-container">
      <GenreSelect handleGenreSelect={handleGenreSelect} />
      <button
        className="radio-select-random-btn"
        disabled={props.isLoading}
        onClick={() =>
          props.handleRandomSelect(getGenreStationSearchStrategy(selectedGenre))
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
