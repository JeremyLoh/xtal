import { Schema } from "express-validator"

export const getPodcastEpisodeValidationSchema: Schema = {
  id: {
    optional: false,
    isLength: {
      options: { min: 1 },
    },
    errorMessage: "'id' should be present",
  },
  limit: {
    escape: true,
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: "'limit' should be between 1 and 100",
    },
  },
}
