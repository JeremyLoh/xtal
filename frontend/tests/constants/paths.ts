export const homePageUrl = () => "http://localhost:5173"
export const radioStationShareUrl = (stationUuid: string) =>
  homePageUrl() + `/radio-station/${stationUuid}`
