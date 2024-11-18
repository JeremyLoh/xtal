import "./Map.css"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"

function Map() {
  useEffect(() => {
    const map = L.map("map").setView([1.35, 103.81], 4)
    const stadiaStamenToner = L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}",
      {
        minZoom: 4,
        maxZoom: 15,
        //@ts-ignore
        ext: "png",
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map)
    return () => {
      map.remove()
    }
  })
  return <div id="map"></div>
}

export default Map
