import { pino } from "pino"

const logger = pino({
  name: "xtal-backend",
  level: "info",
  formatters: {
    level: (label) => {
      // print "level" as string (e.g. "info") instead of number - https://getpino.io/#/docs/help?id=log-levels-as-labels-instead-of-numbers
      return {
        level: label,
      }
    },
  },
})

export default logger
