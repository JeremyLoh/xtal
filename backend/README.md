# Xtal Backend

# Features

# Built With

- TypeScript
- Express

# Setup

1. Create an `.env` file at backend root directory (`/backend`) with the following properties:

```shell
PORT=3000
PODCAST_INDEX_API_KEY="???"
PODCAST_INDEX_API_SECRET="???"
FRONTEND_ORIGIN="http://localhost:5173"
```

- `PODCAST_INDEX_API_KEY` and `PODCAST_INDEX_API_SECRET` is obtained from using an account created on https://podcastindex-org.github.io/docs-api/#overview--overview (enclosed in double quotes to escape characters such as `#`)
- `FRONTEND_ORIGIN` is used to set the CORS headers for the backend endpoints. They will only allow the frontend origin (`(new URL()).origin` - https://developer.mozilla.org/en-US/docs/Web/API/URL/origin)

# Running the backend application (Dev)

1. Navigate to the `/backend` directory and run `npm run dev`. `tsx` is used to run the `index.ts` in watch mode (https://tsx.is/)

# Packages used

1. `ky` - performing web requests - https://www.npmjs.com/package/ky
2. `vitest` - test framework - https://vitest.dev/
3. `msw` - mocking HTTP requests - https://mswjs.io/
4. `supertest` - testing HTTP server - https://www.npmjs.com/package/supertest
5. `dayjs` - date utility library - https://day.js.org/
6. `express-validator` - https://express-validator.github.io/docs/
7. `dompurify` - html sanitization (**always update to the latest version**) - https://www.npmjs.com/package/dompurify
8. `jsdom` - create DOM for DOMPurify (**always update to the latest version**) - https://github.com/jsdom/jsdom

# References

1. Troubleshooting proxy issues - https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues - https://express-rate-limit.mintlify.app/reference/error-codes#err-erl-unexpected-x-forwarded-for
   - `app.set("trust proxy", 1) // Trust first proxy (reverse proxy)`
2. How to set up TypeScript with Node.js and Express - https://blog.logrocket.com/how-to-set-up-node-typescript-express/
3. What is module option in tsconfig used for? - https://stackoverflow.com/questions/55471795/what-is-module-option-in-tsconfig-used-for
4. Express-validator: How can i use date birthday validator with checkschema? - https://stackoverflow.com/questions/75091208/express-validator-how-can-i-use-date-birthday-validator-with-checkschema
5. Multiple test file port 3000 already in use - https://stackoverflow.com/questions/54422849/jest-testing-multiple-test-file-port-3000-already-in-use
   - Put `app.listen` in a different file (run listen for each test file instead)
   - OR skip the `app.listen` for `NODE_ENV=test`. `supertest` without `app.listen` will use port 0. (port 0 for choose the first randomly available port that you find)
6. Move your cors() middleware before express.json() and you won't have a CORS issue any more. The problem was due to an error in the express.json() middleware killing the request before CORS headers were added - https://stackoverflow.com/questions/71948888/cors-why-do-i-get-successful-preflight-options-but-still-get-cors-error-with-p
