import { Schema } from "express-validator"

export const getAccountPodcastPlayHistoryValidationSchema: Schema = {
  episodeId: {
    optional: false,
    escape: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "'episodeId' should be present",
    },
  },
  podcastId: {
    optional: false,
    escape: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "'podcastId' should be present",
    },
  },
  episodeTitle: {
    optional: false,
    escape: true,
    isLength: {
      options: { min: 1, max: 500 },
      errorMessage: "'episodeTitle' should be between 1 and 500 characters",
    },
  },
  podcastTitle: {
    optional: false,
    escape: true,
    isLength: {
      options: { min: 1, max: 500 },
      errorMessage: "'podcastTitle' should be between 1 and 500 characters",
    },
  },
  contentUrl: {
    optional: false,
    escape: true,
    isLength: {
      options: { min: 1, max: 2048 },
      errorMessage: "'contentUrl' should be between 1 and 2048 characters",
    },
  },
  durationInSeconds: {
    optional: false,
    escape: true,
    isInt: {
      options: { min: 1, max: 9999999 },
      errorMessage: "'durationInSeconds' should be between 1 and 9999999",
    },
  },
  publishDateUnixTimestamp: {
    optional: true,
    escape: true,
    isISO8601: {
      errorMessage: "'publishDateUnixTimestamp' should be in ISO 8601 format",
    },
  },
  isExplicit: {
    optional: false,
    escape: true,
    isBoolean: {
      errorMessage: "'isExplicit' should be a boolean",
    },
  },
  episodeNumber: {
    optional: true,
    escape: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "'episodeNumber' should be at least zero",
    },
  },
  seasonNumber: {
    optional: true,
    escape: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "'seasonNumber' should be at least zero",
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
  externalWebsiteUrl: {
    optional: true,
    escape: true,
    isLength: {
      options: { min: 7, max: 2048 },
      errorMessage:
        "'externalWebsiteUrl' should be between 7 and 2048 characters",
    },
  },
  // data related to user's podcast episode play time
  resumePlayTimeInSeconds: {
    optional: false,
    escape: true,
    isInt: {
      options: { min: 0 },
      errorMessage: "'resumePlayTimeInSeconds' should be present",
    },
  },
}
