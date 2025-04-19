import { Schema } from "express-validator"

export const getAccountFollowingPodcastValidationSchema: Schema = {
  limit: {
    optional: true,
    escape: true,
    isInt: {
      options: { min: 1, max: 50 },
      errorMessage: "'limit' should be between 1 and 50",
    },
  },
  offset: {
    optional: true,
    escape: true,
    isInt: {
      options: { min: 0, max: 5000 },
      errorMessage: "'offset' should be between 0 and 5000",
    },
  },
}
