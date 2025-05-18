import { Express } from "express"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc, { Options } from "swagger-jsdoc"
import logger from "../logger.js"

const swaggerOptions: Options = {
  definition: {
    openapi: "3.1.1",
    info: { title: "xtal Backend API", version: "1.0.0" },
  },
  apis: ["./route/**/*.ts"], // routes with API annotation (relative path to current working directory "backend/" directory)
}
const openapiSpecification = swaggerJsdoc(swaggerOptions)

function addApiDocumentationRoute(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification))
  logger.info("API documentation deployed on route /api-docs")
}

export { addApiDocumentationRoute }
