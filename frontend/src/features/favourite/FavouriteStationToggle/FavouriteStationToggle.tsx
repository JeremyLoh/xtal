import { useState } from "react"
import { GoStarFill } from "react-icons/go"
import "./FavouriteStationToggle.css"
import FavouriteStationDrawer from "../FavouriteStationDrawer/FavouriteStationDrawer"

function FavouriteStationToggle() {
  const [open, setOpen] = useState<boolean>(false)
  function handleClick() {
    setOpen(!open)
  }
  return (
    <>
      <button
        onClick={handleClick}
        data-testid="favourite-station-toggle-btn"
        className="favourite-station-toggle-btn"
        title="View Favourites List"
      >
        <GoStarFill size={24} color="#facc15" />
      </button>
      {open && <FavouriteStationDrawer open={open} setOpen={setOpen} />}
    </>
  )
}

export default FavouriteStationToggle
