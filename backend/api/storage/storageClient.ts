import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "./supabase.js"

// Create singleton for the supabase client
let instance: StorageClient

class StorageClient {
  private supabase: SupabaseClient<Database, "public", any>

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
    const uploadFilePromise = this.supabase.storage
      .from("podcast-image") // bucket name
      .upload(filePath, this.decode(base64FileData), {
        contentType: contentType, // e.g. "image/png"
      })
    const insertDatabasePromise = this.supabase
      .from("podcast_images") // database name
      .insert({ url: url, storage_file_name: fileName })
    const promises = await Promise.allSettled([
      uploadFilePromise,
      insertDatabasePromise,
    ])
    const deleteOperationsBasedOnPromises = [
      async () => {
        // delete upload file
        const { error } = await this.supabase.storage
          .from("podcast-image") // bucket name
          .remove([filePath])
        if (error) {
          console.error(
            `uploadFileAndUpdateDatabase(): could not delete upload file. image url ${url}, storage file path: ${filePath}`
          )
        } else {
          console.log(`uploadFileAndUpdateDatabase(): successful deletion of `)
        }
      },
      async () => {
        // delete database row from table "podcast_images"
        const { status } = await this.supabase
          .from("podcast_images")
          .delete()
          .eq("url", url)
          .select()
        if (status !== 200) {
          console.error(
            `uploadFileAndUpdateDatabase(): could not delete database row for table 'podcast_images'. image url ${url}`
          )
        }
      },
    ]
    if (promises.some((p) => p.status === "rejected")) {
      for (let i = 0; i < promises.length; i++) {
        const p = promises[i]
        // if any promise has "status": "rejected", we need to perform a delete for those that were fulfilled
        if (p.status === "fulfilled") {
          console.error(
            `uploadFileAndUpdateDatabase(): attempt to delete for index ${i}. image url: ${url}, width: ${width}, height: ${height}`
          )
          await deleteOperationsBasedOnPromises[i]()
        }
      }
    }
  }

  getFilePublicUrl(fileName: string, width: number, height: number): string {
    // https://supabase.com/docs/reference/javascript/storage-from-getpublicurl
    // does not check if file path is valid
    const { data } = this.supabase.storage
      .from("podcast-image") // bucket name
      .getPublicUrl(`public/w${width}_h${height}/${fileName}`)
    return data.publicUrl
  }

  async getExistingFile(url: string): Promise<string | null> {
    const { data, error, status } = await this.supabase
      .from("podcast_images") // database table
      .select("storage_file_name") // columns to return in data
      .eq("url", url)
      .limit(1)
    if (data == null) {
      return null
    }
    if (data[0] && data[0].storage_file_name) {
      return data[0].storage_file_name
    }
    return null
  }
}

const singletonStorageClient = Object.freeze(new StorageClient())
export default singletonStorageClient
