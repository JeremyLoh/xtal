import { toast } from "sonner"
import { Station } from "../api/radiobrowser/types"

function useClipboard() {
  function copyRadioStationShareUrl(station: Station) {
    const origin = new URL(window.location.href).origin
    navigator.clipboard
      .writeText(`${origin}/radio-station/${station.stationuuid}`)
      .catch(() =>
        toast.error("Could not copy radio station share url to clipboard")
      )
  }
  return { copyRadioStationShareUrl }
}

export default useClipboard
