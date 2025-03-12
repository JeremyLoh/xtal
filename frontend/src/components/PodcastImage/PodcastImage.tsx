import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MdOutlineImageNotSupported } from "react-icons/md"
import { getPodcastImage } from "../../api/image/podcastImage.ts"

type PodcastImageProps = {
  imageUrl: string
  size: number
  imageClassName: string
  imageTitle: string
  imageNotAvailableTitle: string
}

export default memo(function PodcastImage({
  imageUrl,
  size,
  imageClassName,
  imageTitle,
  imageNotAvailableTitle,
}: PodcastImageProps) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [fetchPriority, setFetchPriority] = useState<"high" | "low" | "auto">(
    "auto"
  )
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [srcSet, setSrcSet] = useState<string | undefined>(undefined)
  const PODCAST_IMAGE_CONTAINER_STYLE = useMemo(() => {
    return { width: size, height: size, padding: 0, margin: 0 }
  }, [])

  const getImageSrcSet = useCallback(
    (smallImageData: string | null, largeImageData: string | null) => {
      let imageSrcSet = null // populate with both image or any one that was successful
      if (smallImageData && largeImageData) {
        imageSrcSet = `${smallImageData} ${size}w, ${largeImageData} ${
          size * 2
        }w`
      } else if (smallImageData) {
        imageSrcSet = `${smallImageData} ${size}w`
      } else if (largeImageData) {
        imageSrcSet = `${largeImageData} ${size * 2}w`
      }
      return imageSrcSet
    },
    []
  )

  useEffect(() => {
    async function getImageData() {
      if (!imageUrl) {
        return
      }
      abortControllerRef?.current?.abort()
      abortControllerRef.current = new AbortController()
      try {
        const promiseResult = await Promise.allSettled([
          getPodcastImage(abortControllerRef.current, imageUrl, size, size),
          getPodcastImage(
            abortControllerRef.current,
            imageUrl,
            size * 2,
            size * 2
          ),
        ])
        const smallImageData =
          promiseResult[0].status === "fulfilled"
            ? promiseResult[0].value
            : null
        const largeImageData =
          promiseResult[1].status === "fulfilled"
            ? promiseResult[1].value
            : null
        const imageSrcSet = getImageSrcSet(smallImageData, largeImageData)
        if (imageSrcSet != null) {
          setImageSrc(largeImageData)
          setSrcSet(imageSrcSet)
        } else {
          // set to original image as backup image, set fetch priority to high (larger image source)
          setFetchPriority("high")
          setImageSrc(imageUrl)
          setSrcSet(undefined)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Failed to load podcast image", error.message)
      }
    }

    getImageData()
  }, [imageUrl, size])

  return (
    <div className={imageClassName} style={PODCAST_IMAGE_CONTAINER_STYLE}>
      {imageSrc ? (
        <img
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
