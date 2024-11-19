import "./Map.css"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"

function Map() {
  useEffect(() => {
    const map = L.map("map").setView([1.35, 103.81], 4)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 4,
      maxZoom: 15,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)
    return () => {
      map.remove()
    }
  })
  return <div id="map"></div>
}

export default Map
