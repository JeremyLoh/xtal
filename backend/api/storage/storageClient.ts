import { createClient, SupabaseClient } from "@supabase/supabase-js"
import dayjs from "dayjs"
// https://supabase.com/docs/reference/javascript/typescript-support
import { Database } from "../supabase/databaseTypes/supabase.js"
import logger from "../../logger.js"

// Create singleton for the supabase client
let instance: StorageClient

class StorageClient {
  private readonly supabase: SupabaseClient<Database, "public", any>

  constructor() {
    if (instance) {
      throw new Error("Unable to create multiple StorageClient instances")
    }
    if (process.env.SUPABASE_PROJECT_URL == null) {
      throw new Error(
        "Invalid null environment variable 'SUPABASE_PROJECT_URL'"
      )
    }
    if (process.env.SUPABASE_PROJECT_SERVICE_ROLE_API_KEY == null) {
      throw new Error(
        "Invalid null environment variable 'SUPABASE_PROJECT_SERVICE_ROLE_API_KEY'"
      )
    }
    const supabase = createClient<Database>(
      process.env.SUPABASE_PROJECT_URL,
      process.env.SUPABASE_PROJECT_SERVICE_ROLE_API_KEY
    )
    this.supabase = supabase
    instance = this
  }

  getInstance() {
    return this
  }

  private decode(base64FileData: string) {
    return Buffer.from(base64FileData, "base64")
  }

  async uploadFileAndUpdateDatabase({
    base64FileData,
    fileName,
    width,
    height,
    contentType,
    url,
  }: {
    base64FileData: string
    fileName: string
    width: number
    height: number
    contentType: string
    url: string
  }) {
    // https://supabase.com/docs/reference/javascript/storage-from-upload
    const filePath = `public/w${width}_h${height}/${fileName}`
    const { error: uploadFileStorageError } = await this.supabase.storage
      .from("podcast-image") // bucket name
      .upload(filePath, this.decode(base64FileData), {
        contentType: contentType, // e.g. MIME Type "image/webp"
      })
    if (uploadFileStorageError) {
      throw new Error(
        `uploadFileAndUpdateDatabase(): could not upload file to storage ${filePath}. Error ${uploadFileStorageError.message}`
      )
    }
    const { error: insertDatabaseError } = await this.supabase
      .from("podcast_images") // database name
      .insert({
        image_width_image_height_url: `w${width}_h${height}_${url}`,
        storage_file_path: filePath,
      })
    if (insertDatabaseError) {
      // delete the storage file uploaded
      logger.error(
        `uploadFileAndUpdateDatabase(): ${insertDatabaseError.message}`
      )
      try {
        await this.deleteImageStorage([filePath])
      } catch (error: any) {
        logger.error(
          `uploadFileAndUpdateDatabase(): could not delete upload file. image url ${url}, storage file path: ${filePath}`
        )
      }
      return
    }
  }

  getFilePublicUrl(filePath: string): string {
    // https://supabase.com/docs/reference/javascript/storage-from-getpublicurl
    // does not check if file path is valid
    const { data } = this.supabase.storage
      .from("podcast-image") // bucket name
      .getPublicUrl(filePath)
    return data.publicUrl
  }

  async getExistingFile(
    url: string,
    width: number,
    height: number
  ): Promise<string | null> {
    const { data, error } = await this.supabase
      .from("podcast_images") // database table
      .select("storage_file_path") // columns to return in data
      .eq("image_width_image_height_url", `w${width}_h${height}_${url}`)
      .limit(1)
    if (data == null || error) {
      return null
    }
    if (data[0] && data[0].storage_file_path) {
      return data[0].storage_file_path
    }
    return null
  }

  async deleteStorageFilesBefore(deleteBeforeDate: Date, limit: number) {
    const deleteBeforeDateString = dayjs(deleteBeforeDate).format("YYYY-MM-DD")
    const { data, error } = await this.supabase
      .from("podcast_images") // database table
      .select("storage_file_path") // columns to return in data
      .lt("created_at", deleteBeforeDateString) // date format yyyy-mm-dd
      .limit(limit)
    if (error) {
      throw new Error(
        `deleteStorageFilesBefore(): could not get entries to delete, deleteBeforeDate: ${deleteBeforeDateString}. Error: ${error?.details}`
      )
    }
    const deleteDataSize = data.length
    if (deleteDataSize === 0) {
      logger.info("deleteStorageFilesBefore(): zero entries found")
      return
    }
    const chunkSize = 50
    const totalChunks = Math.ceil(deleteDataSize / chunkSize)
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = start + chunkSize
      const deleteChunk = data.slice(start, end)
      const filePaths = deleteChunk.map((data) => data.storage_file_path)
      let deletedFilePaths: string[] | undefined = []
      try {
        // get file paths that are deleted e.g public/w300_h300/yAl3PRi5tDcd1Bfo6x4mv.webp
        deletedFilePaths = await this.deleteImageStorage(filePaths)
        if (!deletedFilePaths) {
          continue
        }
      } catch (error: any) {
        logger.error(
          `deleteStorageFilesBefore(): Failed to delete image files. Start Index: ${start}, End Index: ${end} Error: ${
            error.message
          }. Image file Paths: ${JSON.stringify(filePaths)}`
        )
        continue // do not proceed if image deletion has failed, leave the database row intact
      }
      if (deletedFilePaths == undefined || deletedFilePaths.length === 0) {
        continue
      }
      logger.info(
        `deleteStorageFilesBefore(): attempting to delete files from database: ${deletedFilePaths}`
      )
      try {
        await this.deleteImageDatabaseRowsWithStorageFilePath(deletedFilePaths)
      } catch (error: any) {
        logger.error(
          `deleteStorageFilesBefore(): Failed to delete image database rows. Start Index: ${start}, End Index: ${end} Error: ${
            error.message
          }. Database attempted deletion file paths: ${JSON.stringify(
            filePaths
          )}`
        )
      }
      // sleep after deleting a chunk
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  private async deleteImageDatabaseRowsWithStorageFilePath(
    storageFilePaths: string[]
  ) {
    if (storageFilePaths == null || storageFilePaths.length === 0) {
      return
    }
    const { status, error } = await this.supabase
      .from("podcast_images")
      .delete()
      .in("storage_file_path", storageFilePaths)
    if (error) {
      throw new Error(
        `deleteImageDatabaseRowsWithStorageFilePath(): could not delete ${JSON.stringify(
          storageFilePaths
        )}. Status: ${status}. Error: ${error?.message}`
      )
    }
  }

  private async deleteImageStorage(
    filePaths: string[]
  ): Promise<string[] | undefined> {
    if (filePaths == null || filePaths.length === 0) {
      return
    }
    const { data, error } = await this.supabase.storage
      .from("podcast-image") // bucket name
      .remove(filePaths)
    if (error) {
      throw new Error(`deleteImageStorage(): Error: ${error.message}`)
    }
    if (data) {
      const deletedFilePaths = data.map((d) => d.name)
      const deletedFilesSet = new Set(deletedFilePaths)
      const missingDeleteFiles = filePaths.filter(
        (p) => !deletedFilesSet.has(p)
      )
      if (missingDeleteFiles.length > 0) {
        logger.error(
          `deleteImageStorage(): could not delete file paths: ${missingDeleteFiles}`
        )
      }
      return deletedFilePaths
    }
  }
}

const singletonStorageClient = Object.freeze(new StorageClient())
export default singletonStorageClient
