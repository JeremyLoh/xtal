import { Schema } from "express-validator"

export const getPodcastTrendingValidationSchema: Schema = {
  max: {
    optional: true,
    escape: true,
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: "'max' should be between 1 and 100",
    },
  },
}
