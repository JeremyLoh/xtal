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
```

- `PODCAST_INDEX_API_KEY` and `PODCAST_INDEX_API_SECRET` is obtained from using an account created on https://podcastindex-org.github.io/docs-api/#overview--overview (enclosed in double quotes to escape characters such as `#`)

# Running the application (Dev)

1. Navigate to the `/backend` directory and run `npm run dev`. `tsx` is used to run the `index.ts` in watch mode (https://tsx.is/)

# Packages used

1. `ky` - performing web requests - https://www.npmjs.com/package/ky
2. `vitest` - test framework - https://vitest.dev/
3. `msw` - (mocking HTTP requests) - https://mswjs.io/
4. `supertest` - testing HTTP server - https://www.npmjs.com/package/supertest
5. `dayjs` - date utility library - https://day.js.org/
6. `express-validator` - https://express-validator.github.io/docs/

# References

1. How to set up TypeScript with Node.js and Express - https://blog.logrocket.com/how-to-set-up-node-typescript-express/
2. What is module option in tsconfig used for? - https://stackoverflow.com/questions/55471795/what-is-module-option-in-tsconfig-used-for
3. Express-validator: How can i use date birthday validator with checkschema? - https://stackoverflow.com/questions/75091208/express-validator-how-can-i-use-date-birthday-validator-with-checkschema
4. Multiple test file port 3000 already in use - https://stackoverflow.com/questions/54422849/jest-testing-multiple-test-file-port-3000-already-in-use
   - Put `app.listen` in a different file (run listen for each test file instead)
   - OR skip the `app.listen` for `NODE_ENV=test`. `supertest` without `app.listen` will use port 0. (port 0 for choose the first randomly available port that you find)
