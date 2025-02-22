import { toast } from "sonner"
import { Station } from "../api/radiobrowser/types.ts"

function useClipboard() {
  function copyRadioStationShareUrl(station: Station) {
    const origin = new URL(window.location.href).origin
    navigator.clipboard
      .writeText(`${origin}/radio-station/${station.stationuuid}`)
      .then(() => toast.success("Link Copied"))
      .catch(() =>
        toast.error("Could not copy radio station share url to clipboard")
      )
  }
  return { copyRadioStationShareUrl }
}

export default useClipboard
