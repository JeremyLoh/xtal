import { Schema } from "express-validator"

export const getAccountFollowPodcastValidationSchema: Schema = {
  podcastId: {
    optional: false,
    escape: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "'podcastId' should be present",
    },
  },
}

export const getAddAccountFollowPodcastValidationSchema: Schema = {
  podcastId: {
    optional: false,
    escape: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "'podcastId' should be present",
    },
  },
  externalWebsiteUrl: {
    optional: true,
    escape: true,
    isLength: {
      options: { min: 7, max: 2048 },
      errorMessage:
        "'externalWebsiteUrl' should be between 7 and 2048 characters",
    },
  },
  title: {
    optional: false,
    escape: true,
    isLength: {
      options: { min: 1, max: 500 },
      errorMessage: "'title' should be between 1 and 500 characters",
    },
  },
  author: {
    optional: false,
    escape: true,
    isLength: {
      options: { min: 1, max: 500 },
      errorMessage: "'author' should be between 1 and 500 characters",
    },
  },
  image: {
    optional: false,
    escape: true,
    isLength: {
      options: { min: 5, max: 2048 },
      errorMessage: "'image' should be between 5 and 2048 characters",
    },
  },
  language: {
    optional: true,
    escape: true,
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: "'language' should be between 2 and 64 characters",
    },
  },
  publishDateUnixTimestamp: {
    optional: true,
    escape: true,
    isISO8601: {
      errorMessage: "'publishDateUnixTimestamp' should be in ISO 8601 format",
    },
  },
  episodeCount: {
    optional: true,
    escape: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "'episodeCount' should be at least zero",
    },
  },
  categories: {
    optional: true,
    escape: true,
    isArray: {
      options: { min: 0 },
      errorMessage: "'categories' should not be an empty array",
    },
  },
}
