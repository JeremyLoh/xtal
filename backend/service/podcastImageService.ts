import ky from "ky"
import sharp from "sharp"
import { nanoid } from "nanoid"
import StorageClient from "../api/storage/storageClient.js"

export async function getImage(
  url: string,
  width: number,
  height: number
): Promise<Buffer> {
  const storageClient = StorageClient.getInstance()
  const { exists, fileName } = await checkForExistingImage(url)
  if (exists && fileName) {
    const filePublicUrl = storageClient.getFilePublicUrl(
      fileName,
      width,
      height
    )
    console.log(`getImage(): file already exists ${fileName}`)
    const existingImageBuffer = await downloadImageFromUrl(filePublicUrl)
    return existingImageBuffer
  } else {
    const newImageBuffer = await storeNewImage(url, width, height)
    return newImageBuffer
  }
}

async function storeNewImage(url: string, width: number, height: number) {
  const storageClient = StorageClient.getInstance()
  const imageArrayBuffer = await downloadImageFromUrl(url)
  const resizedAndCompressedImageBuffer = await resizeAndCompressImage(
    imageArrayBuffer,
    width,
    height
  )
  const uploadFileName = nanoid() + ".webp"
  // upload file to storage bucket (make sure size is smaller than 10MB) (buffer.byteLength)
  await storageClient.uploadFileAndUpdateDatabase({
    contentType: "image/webp",
    fileName: uploadFileName,
    base64FileData: resizedAndCompressedImageBuffer.toString("base64"),
    width,
    height,
    url,
  })
  return resizedAndCompressedImageBuffer
}

async function checkForExistingImage(url: string) {
  const storageClient = StorageClient.getInstance()
  const fileName = await storageClient.getExistingFile(url)
  if (fileName) {
    return {
      exists: true,
      fileName: fileName,
    }
  }
  return {
    exists: false,
    fileName: null,
  }
}

async function downloadImageFromUrl(url: string): Promise<Buffer> {
  const arrayBuffer = await ky.get(url, { retry: 0 }).arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function resizeAndCompressImage(
  buffer: ArrayBuffer,
  width: number,
  height: number
) {
  return await sharp(buffer)
    .resize(width, height, { fit: "cover" })
    .webp({ quality: 65, effort: 2, lossless: false })
    .toBuffer()
}
