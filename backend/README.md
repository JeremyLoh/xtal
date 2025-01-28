# Xtal Backend

# Features

# Built With

- TypeScript
- Express

# Setup

1. Create an `.env` file at backend root directory (`/backend`) with the following properties:

```shell
PORT=3000
```

# Running the application (Dev)

1. Navigate to the `/backend` directory and run `npm run dev`. `tsx` is used to run the `index.ts` in watch mode (https://tsx.is/)

# Packages used

1. `ky` - performing web requests - https://www.npmjs.com/package/ky
2. `vitest` - test framework - https://vitest.dev/
3. `msw` - (mocking HTTP requests) - https://mswjs.io/
4. `supertest` - testing HTTP server - https://www.npmjs.com/package/supertest

# References

1. How to set up TypeScript with Node.js and Express - https://blog.logrocket.com/how-to-set-up-node-typescript-express/
2. What is module option in tsconfig used for? - https://stackoverflow.com/questions/55471795/what-is-module-option-in-tsconfig-used-for
