export type CountryStation = {
  countryCode: string
  name: string
  stationCount: number
}

export const DEFAULT_COUNTRY_SEARCH: CountryStation = {
  countryCode: "US",
  name: "The United States Of America",
  stationCount: 6650,
}

// Data retrieved on 2 December 2024, countryCode is based on ISO 3166
// https://de1.api.radio-browser.info/json/countries?order=stationcount&reverse=true
export const countryStationInfo: Array<CountryStation> = [
  {
    countryCode: "US",
    name: "The United States Of America",
    stationCount: 6650,
  },
  {
    countryCode: "DE",
    name: "Germany",
    stationCount: 5301,
  },
  {
    countryCode: "FR",
    name: "France",
    stationCount: 2495,
  },
  {
    countryCode: "CN",
    name: "China",
    stationCount: 1953,
  },
  {
    countryCode: "GR",
    name: "Greece",
    stationCount: 1937,
  },
  {
    countryCode: "GB",
    name: "The United Kingdom Of Great Britain And Northern Ireland",
    stationCount: 1867,
  },
  {
    countryCode: "AU",
    name: "Australia",
    stationCount: 1729,
  },
  {
    countryCode: "MX",
    name: "Mexico",
    stationCount: 1618,
  },
  {
    countryCode: "IT",
    name: "Italy",
    stationCount: 1592,
  },
  {
    countryCode: "CA",
    name: "Canada",
    stationCount: 1449,
  },
  {
    countryCode: "ES",
    name: "Spain",
    stationCount: 1247,
  },
  {
    countryCode: "BR",
    name: "Brazil",
    stationCount: 1219,
  },
  {
    countryCode: "PL",
    name: "Poland",
    stationCount: 1188,
  },
  {
    countryCode: "AR",
    name: "Argentina",
    stationCount: 906,
  },
  {
    countryCode: "NL",
    name: "The Netherlands",
    stationCount: 875,
  },
  {
    countryCode: "PH",
    name: "The Philippines",
    stationCount: 827,
  },
  {
    countryCode: "CH",
    name: "Switzerland",
    stationCount: 559,
  },
  {
    countryCode: "RO",
    name: "Romania",
    stationCount: 531,
  },
  {
    countryCode: "ID",
    name: "Indonesia",
    stationCount: 485,
  },
  {
    countryCode: "CO",
    name: "Colombia",
    stationCount: 458,
  },
  {
    countryCode: "BE",
    name: "Belgium",
    stationCount: 391,
  },
  {
    countryCode: "CL",
    name: "Chile",
    stationCount: 385,
  },
  {
    countryCode: "RS",
    name: "Serbia",
    stationCount: 344,
  },
  {
    countryCode: "HU",
    name: "Hungary",
    stationCount: 327,
  },
  {
    countryCode: "AT",
    name: "Austria",
    stationCount: 316,
  },
  {
    countryCode: "PE",
    name: "Peru",
    stationCount: 308,
  },
  {
    countryCode: "CZ",
    name: "Czechia",
    stationCount: 300,
  },
  {
    countryCode: "PT",
    name: "Portugal",
    stationCount: 297,
  },
  {
    countryCode: "BG",
    name: "Bulgaria",
    stationCount: 280,
  },
  {
    countryCode: "HR",
    name: "Croatia",
    stationCount: 257,
  },
  {
    countryCode: "DK",
    name: "Denmark",
    stationCount: 239,
  },
  {
    countryCode: "NZ",
    name: "New Zealand",
    stationCount: 214,
  },
  {
    countryCode: "IE",
    name: "Ireland",
    stationCount: 206,
  },
  {
    countryCode: "SE",
    name: "Sweden",
    stationCount: 203,
  },
  {
    countryCode: "JP",
    name: "Japan",
    stationCount: 191,
  },
  {
    countryCode: "UY",
    name: "Uruguay",
    stationCount: 175,
  },
  {
    countryCode: "EC",
    name: "Ecuador",
    stationCount: 173,
  },
  {
    countryCode: "SK",
    name: "Slovakia",
    stationCount: 172,
  },
  {
    countryCode: "ZA",
    name: "South Africa",
    stationCount: 155,
  },
  {
    countryCode: "FI",
    name: "Finland",
    stationCount: 133,
  },
  {
    countryCode: "MY",
    name: "Malaysia",
    stationCount: 122,
  },
  {
    countryCode: "SI",
    name: "Slovenia",
    stationCount: 113,
  },
  {
    countryCode: "TW",
    name: "Taiwan, Republic Of China",
    stationCount: 103,
  },
  {
    countryCode: "EE",
    name: "Estonia",
    stationCount: 102,
  },
  {
    countryCode: "TH",
    name: "Thailand",
    stationCount: 99,
  },
  {
    countryCode: "NO",
    name: "Norway",
    stationCount: 92,
  },
  {
    countryCode: "KR",
    name: "The Republic Of Korea",
    stationCount: 90,
  },
  {
    countryCode: "LT",
    name: "Lithuania",
    stationCount: 84,
  },
  {
    countryCode: "LK",
    name: "Sri Lanka",
    stationCount: 77,
  },
  {
    countryCode: "BO",
    name: "Bolivia",
    stationCount: 77,
  },
  {
    countryCode: "LV",
    name: "Latvia",
    stationCount: 76,
  },
  {
    countryCode: "GT",
    name: "Guatemala",
    stationCount: 74,
  },
  {
    countryCode: "HK",
    name: "Hong Kong",
    stationCount: 67,
  },
  {
    countryCode: "PY",
    name: "Paraguay",
    stationCount: 60,
  },
  {
    countryCode: "CR",
    name: "Costa Rica",
    stationCount: 58,
  },
  {
    countryCode: "AL",
    name: "Albania",
    stationCount: 54,
  },
  {
    countryCode: "VN",
    name: "Vietnam",
    stationCount: 51,
  },
  {
    countryCode: "SN",
    name: "Senegal",
    stationCount: 51,
  },
  {
    countryCode: "CY",
    name: "Cyprus",
    stationCount: 48,
  },
  {
    countryCode: "SG",
    name: "Singapore",
    stationCount: 46,
  },
  {
    countryCode: "JM",
    name: "Jamaica",
    stationCount: 36,
  },
  {
    countryCode: "LU",
    name: "Luxembourg",
    stationCount: 33,
  },
  {
    countryCode: "GE",
    name: "Georgia",
    stationCount: 31,
  },
  {
    countryCode: "MO",
    name: "Macao",
    stationCount: 31,
  },
  {
    countryCode: "NP",
    name: "Nepal",
    stationCount: 29,
  },
]
