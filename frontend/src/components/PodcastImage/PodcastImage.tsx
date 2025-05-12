import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MdOutlineImageNotSupported } from "react-icons/md"
import { getPodcastImage } from "../../api/image/podcastImage.ts"
import useScreenDimensions from "../../hooks/useScreenDimensions.ts"

type PodcastImageProps = {
  imageUrl: string
  size: number
  imageClassName: string
  imageTitle: string
  imageNotAvailableTitle: string
  lazyLoad?: boolean
}

export default memo(function PodcastImage({
  imageUrl,
  size,
  imageClassName,
  imageTitle,
  imageNotAvailableTitle,
  lazyLoad,
}: PodcastImageProps) {
  const { devicePixelRatio } = useScreenDimensions()
  const abortControllerRef = useRef<AbortController | null>(null)
  const [fetchPriority, setFetchPriority] = useState<"high" | "low" | "auto">(
    "auto"
  )
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [srcSet, setSrcSet] = useState<string | undefined>(undefined)
  const PODCAST_IMAGE_CONTAINER_STYLE = useMemo(() => {
    return { width: size, height: size, padding: 0, margin: 0 }
  }, [size])

  const setBackupImage = useCallback(() => {
    // set to original image as backup image, set fetch priority to high (larger image source)
    setFetchPriority("high")
    setImageSrc(imageUrl)
    setSrcSet(undefined)
  }, [imageUrl])

  const getImage = useCallback(
    async (abortController: AbortController) => {
      const MAX_BACKEND_IMAGE_SIZE = 500 // backend has validation for image size of max 500px
      const newSize = Math.min(size * devicePixelRatio, MAX_BACKEND_IMAGE_SIZE)
      const imageData = await getPodcastImage(
        abortController,
        imageUrl,
        newSize,
        newSize
      )
      const imageSrcSet = imageData ? `${imageData} ${newSize}w` : null
      return { imageData, imageSrcSet }
    },
    [devicePixelRatio, imageUrl, size]
  )

  useEffect(() => {
    async function getImageData() {
      if (!imageUrl) {
        return
      }
      abortControllerRef?.current?.abort()
      abortControllerRef.current = new AbortController()
      try {
        const { imageData, imageSrcSet } = await getImage(
          abortControllerRef.current
        )
        if (imageData != null && imageSrcSet != null) {
          setImageSrc(imageData)
          setSrcSet(imageSrcSet)
        } else {
          setBackupImage()
        }
      } catch {
        setBackupImage()
      }
    }

    getImageData()
  }, [imageUrl, size, getImage, setBackupImage])

  return (
    <div className={imageClassName} style={PODCAST_IMAGE_CONTAINER_STYLE}>
      {imageSrc ? (
        <img
          {...(lazyLoad && { loading: "lazy" })}
          className={imageClassName}
          decoding="async"
          src={imageSrc}
          srcSet={srcSet}
          fetchPriority={fetchPriority}
          height={size}
          width={size}
          title={imageTitle}
        />
      ) : (
        <MdOutlineImageNotSupported
          size={size}
          title={imageNotAvailableTitle}
        />
      )}
    </div>
  )
})
