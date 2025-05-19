import { decodeHTML } from "entities"
import { CorsOptions } from "cors"
import { Request, Response, Router } from "express"
import supertokens from "supertokens-node"
import logger from "../logger.js"

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
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true, // Access-Control-Allow-Credentials for cookies
  }
}

export function allowAllCorsOptions(): CorsOptions {
  // DO NOT USE IN PRODUCTION! for enabling all origins in development
  return {
    origin: (requestOrigin, callback) => {
      callback(null, requestOrigin) // allow all origins
    }, // Access-Control-Allow-Origin, allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true, // Access-Control-Allow-Credentials for cookies
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(decodeHTML(url))
    return true
  } catch (error) {
    return false
  }
}

export function getProxyTroubleshootingRouter() {
  //@ts-ignore
  const troubleshootingRouter = new Router()
  troubleshootingRouter.get("/ip", (request: Request, response: Response) =>
    response.send(request.ip)
  )
  troubleshootingRouter.get(
    "/x-forwarded-for",
    (request: Request, response: Response) => {
      logger.info(request.headers)
      response.send(request.headers["x-forwarded-for"])
    }
  )
  return troubleshootingRouter
}
