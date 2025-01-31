import { CorsOptions } from "cors"

export function getCorsOptions(): CorsOptions {
  const frontendOrigin = process.env.FRONTEND_ORIGIN
  return {
    origin: (requestOrigin, callback) => {
      // https://stackoverflow.com/questions/71948888/cors-why-do-i-get-successful-preflight-options-but-still-get-cors-error-with-p
      if (!requestOrigin || requestOrigin == undefined) {
        callback(new Error("Invalid origin"))
        return
      }
      const regex = new RegExp("^" + frontendOrigin + "$")
      try {
        const isAllowed = regex.test(new URL(requestOrigin).origin)
        if (isAllowed) {
          callback(null, requestOrigin)
        } else {
          callback(new Error("Origin is not allowed"))
        }
      } catch (error) {
        callback(new Error("Could not process origin"))
      }
    }, // Access-Control-Allow-Origin, allow only frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Access-Control-Allow-Credentials for cookies
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}
