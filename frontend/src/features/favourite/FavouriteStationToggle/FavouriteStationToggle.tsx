import "./FavouriteStationToggle.css"
import { lazy, memo, useState } from "react"
import { GoStarFill } from "react-icons/go"
import Button from "../../../components/ui/button/Button.tsx"
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
      <Button
        keyProp="favourite-station-toggle-button"
        onClick={handleClick}
        data-testid="favourite-station-toggle-button"
        className="favourite-station-toggle-button"
        title="View Favourites List"
      >
        <GoStarFill size={20} />
      </Button>
      {open && <FavouriteStationDrawer open={open} setOpen={setOpen} />}
    </>
  )
}

export default memo(FavouriteStationToggle)
