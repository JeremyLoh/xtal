import "./Map.css"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Station } from "../../../../api/radiobrowser/types"
import RadioCard from "../RadioCard/RadioCard"
import { toast } from "sonner"

let map: L.Map

type MapProps = {
  station: Station | null
}

function Map(props: MapProps) {
  const [popupContainer, setPopupContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    map = setupMap()
    return () => {
      map.remove()
    }
  }, [])
  useEffect(() => {
    if (props.station == null) {
      return
    }
    const location = getStationLocation(props.station)
    const popupDiv = document.createElement("div")
    const popup = L.popup({ minWidth: 300, keepInView: true })
      .setLatLng(location)
      .setContent(popupDiv)
      .openOn(map)
    setPopupContainer(popupDiv)
    map.panTo(location, { animate: true })
    return () => {
      popup.remove()
    }
  }, [setPopupContainer, props.station])
  return (
    <div id="map">
      {popupContainer !== null &&
        props.station &&
        createPortal(<RadioCard station={props.station} />, popupContainer)}
    </div>
  )
}

function setupMap() {
  const map = L.map("map").setView([0, 0], 4)
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: 4,
    maxZoom: 9,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  return map
}

function getStationLocation(station: Station) {
  if (station.geo_lat && station.geo_long) {
    return { lat: station.geo_lat, lng: station.geo_long }
  } else {
    console.error("Could not get coordinates for station: ", station.name)
    toast.info("Could not get station location")
    return { lat: 0, lng: 0 }
  }
}

export default Map
