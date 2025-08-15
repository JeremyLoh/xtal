import ky from "ky"
import sharp from "sharp"
import { nanoid } from "nanoid"
import StorageClient from "../api/storage/storageClient.js"
import logger from "../logger.js"

export async function getImage(
  url: string,
  width: number,
  height: number
): Promise<Buffer> {
  const storageClient = StorageClient.getInstance()
  const { exists, filePath } = await checkForExistingImage(url, width, height)
  if (exists && filePath) {
    const filePublicUrl = storageClient.getFilePublicUrl(filePath)
    logger.info(`getImage(): filePath already exists ${filePath}`)
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

async function checkForExistingImage(
  url: string,
  width: number,
  height: number
) {
  const storageClient = StorageClient.getInstance()
  const filePath = await storageClient.getExistingFile(url, width, height)
  if (filePath) {
    return { exists: true, filePath: filePath }
  }
  return { exists: false, filePath: null }
}

async function downloadImageFromUrl(url: string): Promise<Buffer> {
  const arrayBuffer = await ky.get(url, { retry: 0 }).arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function resizeAndCompressImage(
  buffer: Buffer,
  width: number,
  height: number
) {
  return await sharp(buffer)
    .resize(width, height, { fit: "cover" })
    .webp({ quality: 80, effort: 2, lossless: false })
    .toBuffer()
}
