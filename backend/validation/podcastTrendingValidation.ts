import dayjs from "dayjs"
import { Schema } from "express-validator"

export const getPodcastTrendingValidationSchema: Schema = {
  limit: {
    optional: true,
    escape: true,
    isInt: {
      options: { min: 1, max: 100 },
      errorMessage: "'limit' should be between 1 and 100",
    },
  },
  since: {
    optional: true,
    escape: true,
    custom: {
      options: (unixTimestamp) => {
        const currentTimestamp = dayjs()
        const givenTimestamp = dayjs.unix(unixTimestamp)
        if (!givenTimestamp.isValid()) {
          throw new Error(
            "'since' should be a number representing a unix timestamp between 120 days before current unix timestamp to current unix timestamp"
          )
        }
        if (givenTimestamp.isAfter(currentTimestamp)) {
          throw new Error("'since' should be before current unix timestamp")
        }
        if (givenTimestamp.isBefore(currentTimestamp.subtract(120, "days"))) {
          throw new Error(
            "'since' should be between 120 days before current unix timestamp to current unix timestamp"
          )
        }
      },
    },
  },
}
