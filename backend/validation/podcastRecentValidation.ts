import { Schema } from "express-validator"
import { Language } from "../model/podcast.js"

export const getPodcastRecentValidationSchema: Schema = {
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
      options: { min: 0, max: 500 },
      errorMessage: "'offset' should be between 0 and 500",
    },
  },
  lang: {
    optional: true,
    escape: true,
    isIn: {
      options: [Object.keys(Language)],
      errorMessage: `'lang' should be a string representing a ISO 639 language code. Valid values: ${JSON.stringify(
        Language
      )}`,
    },
  },
}
