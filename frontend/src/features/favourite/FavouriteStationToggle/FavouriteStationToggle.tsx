import "./FavouriteStationToggle.css"
import { lazy, useState } from "react"
import { GoStarFill } from "react-icons/go"
const FavouriteStationDrawer = lazy(
  () => import("../FavouriteStationDrawer/FavouriteStationDrawer.tsx")
)

function FavouriteStationToggle() {
  const [open, setOpen] = useState<boolean>(false)
  function handleClick() {
    setOpen(!open)
  }
  return (
    <>
      <button
        onClick={handleClick}
        data-testid="favourite-station-toggle-button"
        className="favourite-station-toggle-button"
        title="View Favourites List"
      >
        <GoStarFill size={24} color="#facc15" />
      </button>
      {open && <FavouriteStationDrawer open={open} setOpen={setOpen} />}
    </>
  )
}

export default FavouriteStationToggle
