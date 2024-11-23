type Station = {
  changeuuid: string
  stationuuid: string
  name: string
  url: string // stream url provided by user
  url_resolved: string // automatically "resolved" stream url (e.g. playlists, HTTP redirects). Useful for platform where resolve is not possible (JS in browser)
  homepage: string
  favicon: string
  tags: string // comma separated string with tags of the stream
  country: string
  countrycode: string // Official countrycodes as in ISO 3166-1 alpha-2 https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
  state: string
  iso_3166_2: string | null // The ISO-3166-2 code of the entity where the station is located inside the country
  language: string // comma separated string of languages spoken in stream
  languagecodes: string // comma separated string of languages spoken in stream by code ISO 639-2/B https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
  votes: number // number of votes for this station, will only increase (cannot be reset to zero)
  lastchangetime: string // last time stream information was changed in database, format datetime, YYYY-MM-DD HH:mm:ss
  lastchangetime_iso8601: string
  codec: string // codec of stream recorded when last checked
  bitrate: number // integer representing bitrate (bps) of the stream recorded when last checked
  hls: 0 | 1 // mark if this stream is using HLS distribution or non-HLS (HLS => HTTP Live Streaming)
  lastcheckok: 0 | 1 // current offline/online state of this stream (majority vote)
  lastchecktime: string // last time when any server checked online state of the stream, datetime YYYY-MM-DD HH:mm:ss
  lastchecktime_iso8601: string
  lastcheckoktime: string // last time when stream was checked for online status with positive result, datetime, YYYY-MM-DD HH:mm:ss
  lastcheckoktime_iso8601: string
  lastlocalchecktime: string // last time when server checked online state and the metadata of stream, datetime, YYYY-MM-DD HH:mm:ss
  lastlocalchecktime_iso8601: string
  clicktimestamp: string | "" // time of last click recorded for stream, datetime, YYYY-MM-DD HH:mm:ss
  clicktimestamp_iso8601: string | null
  clickcount: number // clicks within last 24 hours (integer)
  clicktrend: number // difference of clickcount within last two days. Positive value means an increase number of clicks
  ssl_error: 0 | 1 // 0 means no error, 1 means there is an ssl error when connecting to the stream url
  geo_lat: number | null // double representing latitude on earth where the stream is located
  geo_long: number | null // double representing longitude on earth where the stream is located
  has_extended_info: boolean // true if stream owner does provide extended information as HTTP headers which override information in database
}

export type { Station }
