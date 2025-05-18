# Xtal Backend

# Features

# Built With

- TypeScript
- Express
- Supabase

# Setup

**IMPORTANT**: The `backend/middleware/csp.ts` value for the Content Security Policy header should match the frontend `frontend/index.html` `<meta http-equiv="content-security-policy">` `content` value. For the backend CSP header, it should be converted to one line without newlines

1. Create an `.env` file at backend root directory (`/backend`) with the following properties:

```shell
PORT=3000
ENABLE_API_DOCUMENTATION="false" # Either "true" or "false" (false for production)
ENABLE_CRON_JOBS="false" # ONLY ENABLE ("true") FOR PRODUCTION
PODCAST_INDEX_API_KEY="???"
PODCAST_INDEX_API_SECRET="???"
FRONTEND_ORIGIN="http://localhost:5173"
BACKEND_ORIGIN="http://localhost:3000"
ENABLE_PROXY_TROUBLESHOOTING="false"
SUPABASE_PROJECT_URL="???_Supabase project url that has PostgreSQL database and Supabase Storage (AWS S3 bucket)"
SUPABASE_PROJECT_SERVICE_ROLE_API_KEY="???_This is the secret service role value for the project. DO NOT COMMIT THIS OR MAKE THIS PUBLIC"
SUPABASE_PUBLIC_KEY="anon public api key in Project Settings => Data API => Project API Keys"
SUPABASE_SIGNING_SECRET="JWT Secret in Project Settings => Data API => JWT Settings"
SUPERTOKENS_CONNECTION_URI="managed SuperTokens.com connection uri"
SUPERTOKENS_API_KEY="managed SuperTokens.com api key"
```

- `ENABLE_CRON_JOBS` is used to start the cron jobs that will clean podcast image files in Supabase database and Supabase storage
- `PODCAST_INDEX_API_KEY` and `PODCAST_INDEX_API_SECRET` is obtained from using an account created on https://podcastindex-org.github.io/docs-api/#overview--overview (enclosed in double quotes to escape characters such as `#`)
- `FRONTEND_ORIGIN` is used to set the CORS headers for the backend endpoints. They will only allow the frontend origin (`(new URL()).origin` - https://developer.mozilla.org/en-US/docs/Web/API/URL/origin)
- `BACKEND_ORIGIN` is used by the cron job to ping the backend to prevent the `https://render.com/` backend from sleeping (after 15 minutes of inactivity) - In production, it should be the backend endpoint
- `ENABLE_PROXY_TROUBLESHOOTING` provide "true" to enable routes `/ip` and `/x-forwarded-for` for troubleshooting the `app.set("trust proxy", 3)` value to put so that the client ip is returned from route `/ip` (allows for more accurate rate limiting of users)
- For Supabase PostgreSQL, create a database table `podcast_images` with `url` as primary key (VARCHAR), `storage_file_path` VARCHAR Unique, `created_at` timestamptz (default of `now()`).
- For Supabase Storage, create a bucket `podcast_image`. It uses folder structure => `public/w200_h200/<UUID>.webp` (e.g. for width 200 and height 200 px, we are also using the webp format)
- Create the `supabase.ts` database types file using the Supabase UI, generate the types from the project in the UI. This needs to be done whenever the database schema changes - https://supabase.com/docs/reference/javascript/typescript-support

# Setup Supabase (Postgresql Database Indexes)

1. `podcast_images` database table column `storage_file_name` should have an index on it (for the cron job image deletion (trying to find images in a list of `storage_file_name`)). It is created when the `unique` constraint is placed on the column during table creation
2. `podcast_episodes` database table column `episode_id` should have an index on it (e.g. for searching user last played timestamp of an episode). It is created when the `unique` constraint is placed on the column during table creation

# Running the backend application (Dev)

1. Navigate to the `/backend` directory and run `npm run dev`. `tsx` is used to run the `index.ts` in watch mode (https://tsx.is/)

# Packages used

- `ky` - performing web requests - https://www.npmjs.com/package/ky
- `vitest` - test framework - https://vitest.dev/
- `msw` - mocking HTTP requests - https://mswjs.io/
- `supertest` - testing HTTP server - https://www.npmjs.com/package/supertest
- `dayjs` - date utility library - https://day.js.org/
- `express-validator` - https://express-validator.github.io/docs/
- `express-rate-limit` - https://www.npmjs.com/package/express-rate-limit
- `dompurify` - html sanitization (**always update to the latest version**) - https://www.npmjs.com/package/dompurify
- `jsdom` - create DOM for DOMPurify (**always update to the latest version**) - https://github.com/jsdom/jsdom
- `sharp` - https://sharp.pixelplumbing.com/
- `supertokens` - https://supertokens.com/
- `@supabase/supabase-js` - https://supabase.com/
- `@2toad/profanity` - https://www.npmjs.com/package/@2toad/profanity

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
7. For Supabase Storage, instead of using package `base64-arraybuffer`, use the `Buffer` built in Node.js - Memory leak in encode - https://github.com/niklasvh/base64-arraybuffer/issues/40

```javascript
const fileContent = "abc"
const fileBase64 = Buffer.from(fileContent).toString("base64") // same as encode(fileContent)
Buffer.from(fileBase64, "base64") // same as decode(fileBase64)
```
