import "./MapView.css"
import "leaflet/dist/leaflet.css"
// @ts-expect-error import minified version - https://leafletjs.com/download.html
import L from "leaflet/dist/leaflet.js"
import { lazy, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import { Station } from "../../../api/radiobrowser/types.ts"

const RadioCard = lazy(() => import("../RadioCard/RadioCard.tsx"))

let map: L.Map

type MapViewProps = {
  station: Station | null
  latLng: L.LatLngExpression
}

function MapView(props: Readonly<MapViewProps>) {
  const [currentPopup, setCurrentPopup] = useState<L.Popup | null>(null)
  const [popupContainer, setPopupContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    map = setupMap()
    return () => {
      map.remove()
    }
  }, [])

  useEffect(() => {
    if (currentPopup !== null && currentPopup.isOpen()) {
      // do not navigate when station is rendered to user
      return
    }
    if (map) {
      // navigate when lat lng changes (e.g. Radio Station "Countries" select)
      map.invalidateSize({ pan: true, animate: true })
      map.panTo(props.latLng, { animate: true })
    }
  }, [currentPopup, props.latLng])

  useEffect(() => {
    if (props.station == null || currentPopup == null || map == null) {
      return
    }
    const location = getStationLocation(props.station)
    map.invalidateSize({ pan: true, animate: true })
    map.panTo(location, { animate: true })
  }, [currentPopup, props.station])

  useEffect(() => {
    if (props.station == null) {
      return
    }
    const location = getStationLocation(props.station)
    const popupDiv = document.createElement("div")
    const popup = L.popup({
      minWidth: 300,
      keepInView: true,
      closeOnClick: false,
    })
      .setLatLng(location)
      .setContent(popupDiv)
      .openOn(map)

    setPopupContainer(popupDiv)
    setCurrentPopup(popup)

    return () => {
      popup.remove()
      setCurrentPopup(null)
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
    toast.info("Could not get station location")
    return { lat: 0, lng: 0 }
  }
}

export default MapView
