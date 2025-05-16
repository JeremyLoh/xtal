import { lazy, memo, useState } from "react"
const FavouriteStationDrawer = lazy(
  () => import("../FavouriteStationDrawer/FavouriteStationDrawer.tsx")
)

function FavouriteStationToggle({ isOpen }: { isOpen: boolean }) {
  const [open, setOpen] = useState<boolean>(isOpen)
  return <>{open && <FavouriteStationDrawer open={open} setOpen={setOpen} />}</>
}

export default memo(FavouriteStationToggle)
