import { Schema } from "express-validator"

export const getPodcastImageValidationSchema: Schema = {
  url: {
    optional: false,
    escape: true,
    isLength: {
      options: { min: 1, max: 2048 },
      errorMessage: "'url' should be a valid url",
    },
  },
  width: {
    optional: false,
    escape: true,
    isInt: {
      options: { min: 16, max: 500 },
      errorMessage: "'width' should be between 16 and 500",
    },
  },
  height: {
    optional: false,
    escape: true,
    isInt: {
      options: { min: 16, max: 500 },
      errorMessage: "'height' should be between 16 and 500",
    },
  },
}
