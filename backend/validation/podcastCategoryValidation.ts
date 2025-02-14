import { Schema } from "express-validator"

export const getPodcastCategoryValidationSchema: Schema = {
  limit: {
    optional: true,
    escape: true,
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: "'limit' should be between 1 and 100",
    },
  },
  offset: {
    optional: true,
    escape: true,
    isInt: {
      options: { min: 1, max: 1000 },
      errorMessage: "'offset' should be between 1 and 1000",
    },
  },
}
