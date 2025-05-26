import rateLimit, { Options } from "express-rate-limit"
import { NextFunction, Request, Response } from "express"

const getTrendingPodcastLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getPodcastSearchLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getPodcastEpisodesLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getPodcastEpisodeLimiter = rateLimit({
  // rate limit for get single podcast episode by podcast episode id
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getPodcastImageConversionLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 40, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getPodcastCategoryLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getPodcastStatsLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 1, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getPodcastRecentLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getStatusLimiter = rateLimit({
  windowMs: 30 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 30) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const deleteAccountLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 1, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getAccountPlayHistoryTimestampLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getAccountPlayHistoryLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const deleteAccountPlayHistoryLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const updateAccountPlayHistoryLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getAccountPlayHistoryCountLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const addAccountFollowPodcastLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 3, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const removeAccountFollowPodcastLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getAccountFollowPodcastLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 3, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getAccountFollowingPodcastLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getAccountTotalCountFollowingPodcastLimiter = rateLimit({
  windowMs: 1 * 1000,
  limit: 2, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 1) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

export default {
  getTrendingPodcastLimiter,
  getPodcastSearchLimiter,
  getPodcastEpisodeLimiter,
  getPodcastEpisodesLimiter,
  getPodcastImageConversionLimiter,
  getPodcastCategoryLimiter,
  getPodcastStatsLimiter,
  getPodcastRecentLimiter,
  getStatusLimiter,
  deleteAccountLimiter,
  getAccountPlayHistoryLimiter,
  getAccountPlayHistoryTimestampLimiter,
  deleteAccountPlayHistoryLimiter,
  updateAccountPlayHistoryLimiter,
  getAccountPlayHistoryCountLimiter,
  addAccountFollowPodcastLimiter,
  removeAccountFollowPodcastLimiter,
  getAccountFollowPodcastLimiter,
  getAccountFollowingPodcastLimiter,
  getAccountTotalCountFollowingPodcastLimiter,
}
