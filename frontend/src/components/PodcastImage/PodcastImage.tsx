import { memo, useEffect, useRef, useState } from "react"
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
  useEffect(() => {
    async function getImageData() {
      if (!imageUrl) {
        return
      }
      abortControllerRef?.current?.abort()
      abortControllerRef.current = new AbortController()
      try {
        // reduce backend load (instead of using Promise.allSettled)
        const smallImageData = await getPodcastImage(
          abortControllerRef.current,
          imageUrl,
          size,
          size
        )
        const largeImageData = await getPodcastImage(
          abortControllerRef.current,
          imageUrl,
          size * 2,
          size * 2
        )
        const imageSrcSet = `${smallImageData} ${size}w, ${largeImageData} ${
          size * 2
        }w`
        if (smallImageData && largeImageData) {
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

  return !imageSrc ? (
    <div className={imageClassName}>
      <MdOutlineImageNotSupported size={size} title={imageNotAvailableTitle} />
    </div>
  ) : (
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
  )
})
