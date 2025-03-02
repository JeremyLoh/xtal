import rateLimit, { Options } from "express-rate-limit"
import { NextFunction, Request, Response } from "express"

const getTrendingPodcastLimiter = rateLimit({
  windowMs: 2 * 1000,
  limit: 1, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 2) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getPodcastEpisodesLimiter = rateLimit({
  windowMs: 2 * 1000,
  limit: 1, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 2) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

const getPodcastEpisodeLimiter = rateLimit({
  // rate limit for get single podcast episode by podcast episode id
  windowMs: 2 * 1000,
  limit: 1, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 2) // in seconds
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

const getStatusLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 1, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.setHeader("retry-after", 300) // in seconds
    res.status(options.statusCode).send(options.message)
  },
})

export default {
  getTrendingPodcastLimiter,
  getPodcastEpisodeLimiter,
  getPodcastEpisodesLimiter,
  getPodcastImageConversionLimiter,
  getPodcastCategoryLimiter,
  getStatusLimiter,
}
