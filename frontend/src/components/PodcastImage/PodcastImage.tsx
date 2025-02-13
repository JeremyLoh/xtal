import { useEffect, useRef, useState } from "react"
import { MdOutlineImageNotSupported } from "react-icons/md"
import { getPodcastImage } from "../../api/image/podcastImage"

type PodcastImageProps = {
  imageUrl: string
  size: number
  imageClassName: string
  imageTitle: string
  imageNotAvailableTitle: string
}

export default function PodcastImage({
  imageUrl,
  size,
  imageClassName,
  imageTitle,
  imageNotAvailableTitle,
}: PodcastImageProps) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  useEffect(() => {
    async function getImageData() {
      if (!imageUrl) {
        return
      }
      abortControllerRef?.current?.abort()
      abortControllerRef.current = new AbortController()
      try {
        const data = await getPodcastImage(
          abortControllerRef.current,
          imageUrl,
          size,
          size
        )
        if (data) {
          setImageSrc(data)
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
      height={size}
      width={size}
      title={imageTitle}
    />
  )
}
