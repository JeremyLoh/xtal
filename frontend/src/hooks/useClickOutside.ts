import { useEffect, useRef } from "react"

function useClickOutside<T extends HTMLElement>({
  onClickOutside,
}: {
  onClickOutside: () => void
}) {
  const elementRef = useRef<T | null>(null)

  useEffect(() => {
    const handClickOutside = (event: MouseEvent) => {
      if (
        elementRef.current &&
        !event.composedPath().includes(elementRef.current)
      ) {
        onClickOutside()
      }
    }
    document.body.addEventListener("click", handClickOutside)
    return () => document.body.removeEventListener("click", handClickOutside)
  }, [onClickOutside])

  return elementRef
}

export default useClickOutside
