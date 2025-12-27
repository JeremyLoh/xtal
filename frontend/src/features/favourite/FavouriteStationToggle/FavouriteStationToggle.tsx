import { lazy, memo, useState } from "react"

const FavouriteStationDrawer = lazy(
  () => import("../FavouriteStationDrawer/FavouriteStationDrawer.tsx")
)

type FavouriteStationToggleProps = { isOpen: boolean }

function FavouriteStationToggle({
  isOpen,
}: Readonly<FavouriteStationToggleProps>) {
  const [open, setOpen] = useState<boolean>(isOpen)
  return <>{open && <FavouriteStationDrawer open={open} setOpen={setOpen} />}</>
}

export default memo(FavouriteStationToggle)
