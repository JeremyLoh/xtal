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

// 100 countries, sorted based on station count (radio browser station api)
// Data retrieved on 2 December 2024, countryCode is based on ISO 3166
// https://de1.api.radio-browser.info/json/countries?order=stationcount&reverse=true&limit=100
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
    countryCode: "RU",
    name: "The Russian Federation",
    stationCount: 2875,
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
    countryCode: "IN",
    name: "India",
    stationCount: 1395,
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
    countryCode: "AE",
    name: "The United Arab Emirates",
    stationCount: 692,
  },
  {
    countryCode: "UG",
    name: "Uganda",
    stationCount: 582,
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
    countryCode: "TR",
    name: "Türkiye",
    stationCount: 475,
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
    countryCode: "UA",
    name: "Ukraine",
    stationCount: 378,
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
    countryCode: "VE",
    name: "Bolivarian Republic Of Venezuela",
    stationCount: 194,
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
    countryCode: "AF",
    name: "Afghanistan",
    stationCount: 156,
  },
  {
    countryCode: "ZA",
    name: "South Africa",
    stationCount: 155,
  },
  {
    countryCode: "SA",
    name: "Saudi Arabia",
    stationCount: 148,
  },
  {
    countryCode: "BA",
    name: "Bosnia And Herzegovina",
    stationCount: 145,
  },
  {
    countryCode: "GI",
    name: "Gibraltar",
    stationCount: 134,
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
    countryCode: "IL",
    name: "Israel",
    stationCount: 109,
  },
  {
    countryCode: "DO",
    name: "The Dominican Republic",
    stationCount: 105,
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
    countryCode: "MA",
    name: "Morocco",
    stationCount: 93,
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
    countryCode: "KE",
    name: "Kenya",
    stationCount: 82,
  },
  {
    countryCode: "TN",
    name: "Tunisia",
    stationCount: 82,
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
    countryCode: "DZ",
    name: "Algeria",
    stationCount: 71,
  },
  {
    countryCode: "BY",
    name: "Belarus",
    stationCount: 69,
  },
  {
    countryCode: "HK",
    name: "Hong Kong",
    stationCount: 67,
  },
  {
    countryCode: "PK",
    name: "Pakistan",
    stationCount: 67,
  },
  {
    countryCode: "EG",
    name: "Egypt",
    stationCount: 66,
  },
  {
    countryCode: "NG",
    name: "Nigeria",
    stationCount: 65,
  },
  {
    countryCode: "CU",
    name: "Cuba",
    stationCount: 63,
  },
  {
    countryCode: "MK",
    name: "Republic Of North Macedonia",
    stationCount: 61,
  },
  {
    countryCode: "PY",
    name: "Paraguay",
    stationCount: 60,
  },
  {
    countryCode: "IR",
    name: "Islamic Republic Of Iran",
    stationCount: 60,
  },
  {
    countryCode: "CR",
    name: "Costa Rica",
    stationCount: 58,
  },
  {
    countryCode: "HN",
    name: "Honduras",
    stationCount: 57,
  },
  {
    countryCode: "LB",
    name: "Lebanon",
    stationCount: 56,
  },
  {
    countryCode: "AL",
    name: "Albania",
    stationCount: 54,
  },
  {
    countryCode: "ME",
    name: "Montenegro",
    stationCount: 53,
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
    countryCode: "SV",
    name: "El Salvador",
    stationCount: 48,
  },
  {
    countryCode: "KZ",
    name: "Kazakhstan",
    stationCount: 48,
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
    countryCode: "MD",
    name: "The Republic Of Moldova",
    stationCount: 46,
  },
  {
    countryCode: "ET",
    name: "Ethiopia",
    stationCount: 46,
  },
  {
    countryCode: "AZ",
    name: "Azerbaijan",
    stationCount: 39,
  },
  {
    countryCode: "PR",
    name: "Puerto Rico",
    stationCount: 37,
  },
  {
    countryCode: "HT",
    name: "Haiti",
    stationCount: 37,
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
  {
    countryCode: "JO",
    name: "Jordan",
    stationCount: 29,
  },
]
