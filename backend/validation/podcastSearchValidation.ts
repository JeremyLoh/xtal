import { Schema } from "express-validator"

export const getPodcastSearchValidationSchema: Schema = {
  q: {
    optional: false,
    escape: true,
    isLength: {
      options: { min: 1, max: 200 },
      errorMessage: "'q' should be present and between 1 and 200 characters",
    },
  },
  limit: {
    optional: false,
    escape: true,
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: "'limit' should be present and between 1 and 100",
    },
  },
  offset: {
    optional: true,
    escape: true,
    isInt: {
      options: { min: 0, max: 1000 },
      errorMessage: "'offset' should be present and between 0 and 1000",
    },
  },
}
