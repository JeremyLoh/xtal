import "./Map.css"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

let map: L.Map

type MapProps = {
  popupContent: JSX.Element | null
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
    if (props.popupContent == null) {
      return
    }
    const popupDiv = document.createElement("div")
    const popup = L.popup({ minWidth: 300, keepInView: true })
      .setLatLng([1.35, 103.81]) // TODO fix hard coded position
      .setContent(popupDiv)
      .openOn(map)
    setPopupContainer(popupDiv)
    return () => {
      popup.remove()
    }
  }, [setPopupContainer, props.popupContent])
  return (
    <div id="map">
      {popupContainer !== null &&
        props.popupContent &&
        createPortal(props.popupContent, popupContainer)}
    </div>
  )
}

function setupMap() {
  const map = L.map("map").setView([1.35, 103.81], 4)
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: 4,
    maxZoom: 15,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  return map
}

export default Map
