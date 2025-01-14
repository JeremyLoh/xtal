import {
  CountryStation,
  DEFAULT_COUNTRY_SEARCH,
} from "../../location/countryStation"
import { DEFAULT_GENRE_SEARCH, GenreInformation } from "../genreTags"
import {
  AdvancedStationSearchCriteria,
  AdvancedStationSearchStrategy,
} from "./AdvancedStationSearchStrategy"
import { CountryStationSearchStrategy } from "./CountryStationSearchStrategy"
import { GenreStationSearchStrategy } from "./GenreStationSearchStrategy"
import { StationSearchStrategy } from "./StationSearchStrategy"
import { UuidSearchStrategy } from "./UuidSearchStrategy"

export enum StationSearchType {
  GENRE = "genre",
  COUNTRY = "country",
  ADVANCED = "advanced",
}

export class SearchStrategyFactory {
  static createDefaultSearchStrategy(
    searchType: StationSearchType
  ): StationSearchStrategy {
    if (searchType === StationSearchType.GENRE) {
      return new GenreStationSearchStrategy(DEFAULT_GENRE_SEARCH)
    }
    if (searchType === StationSearchType.COUNTRY) {
      return new CountryStationSearchStrategy(DEFAULT_COUNTRY_SEARCH)
    }
    throw new Error("Invalid station search type given")
  }

  static createGenreSearchStrategy(genre: GenreInformation) {
    return new GenreStationSearchStrategy(genre)
  }

  static createCountrySearchStrategy(country: CountryStation) {
    return new CountryStationSearchStrategy(country)
  }

  static createAdvancedSearchStrategy(
    searchStrategy: AdvancedStationSearchCriteria,
    limit: number,
    offset: number
  ) {
    return new AdvancedStationSearchStrategy(searchStrategy, limit, offset)
  }

  static createUuidSearchStrategy(stationuuid: string) {
    return new UuidSearchStrategy(stationuuid)
  }
}
