# Xtal Frontend

Made using TypeScript, React and Playwright (end-to-end testing)

# Setup

**IMPORTANT**: The `backend/middleware/csp.ts` value for the Content Security Policy header should match the frontend `frontend/index.html` `<meta http-equiv="content-security-policy">` `content` value. For the backend CSP header, it should be converted to one line without newlines

1. Ensure `node` is installed on your system - https://nodejs.org/en
2. Navigate to the `frontend/` directory
3. Update the `frontend/index.html` `<meta http-equiv="content-security-policy">` CSP tag for the backend endpoints and supabase public project url
4. Create a `.env.production` and `.env.local` file - https://vite.dev/guide/env-and-mode#env-files

   - e.g. `.env.local`

   ```
   VITE_MAX_FAVOURITE_STATIONS_ANONYMOUS=3
   VITE_BACKEND_ORIGIN="http://localhost:3000"
   VITE_FRONTEND_ORIGIN="http://localhost:5173"
   VITE_SUPABASE_PROJECT_URL="???_Supabase project url that has PostgreSQL database and Supabase Storage (AWS S3 bucket)"
   VITE_SUPABASE_PUBLIC_KEY="anon public api key in Project Settings => Data API => Project API Keys"
   QA_TEST_ACCOUNT_EMAIL="test xtal account created for running Playwright tests"
   QA_TEST_ACCOUNT_PASSWORD="test xtal account password created for running Playwright tests"
   ```

5. Install the required dependencies using `npm install`
6. Run `npm run test` (to launch Playwright UI) OR run `npx playwright test` to run tests in headless mode

# Packages used

- `Radio Browser` (API for radio stations) - https://www.radio-browser.info/
- `Podcast Index` (API for podcasts) - https://podcastindex.org/
- `Leaflet` (Map) - https://leafletjs.com/
- `OpenStreetMap tiles` (Tiles for map) - https://operations.osmfoundation.org/policies/tiles/
- `sonner` (Toasts) - https://sonner.emilkowal.ski/
- `react-icons` - https://react-icons.github.io/react-icons/
- `ky` (HTTP requests) - https://www.npmjs.com/package/ky
- `react-hook-form` - https://www.npmjs.com/package/react-hook-form
- `React Router` - https://reactrouter.com/
- `media-chrome` - https://www.media-chrome.org/
- `dompurify` - html sanitization (**always update to the latest version**) - https://www.npmjs.com/package/dompurify
- `supertokens` - https://supertokens.com/
- `@supabase/supabase-js` - https://supabase.com/
- `react-virtuoso` - https://virtuoso.dev/
- `@2toad/profanity` - https://www.npmjs.com/package/@2toad/profanity

Favicon - https://favicon.io/emoji-favicons/computer-disk/

- This favicon was generated using the following graphics from Twitter Twemoji:
- Graphics Title: 1f4bd.svg
- Graphics Author: Copyright 2020 Twitter, Inc and other contributors (https://github.com/twitter/twemoji)
- Graphics Source: https://github.com/twitter/twemoji/blob/master/assets/svg/1f4bd.svg
- Graphics License: CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/)

# References

1. Leaflet Map, not rendering tiles properly (just include `import 'leaflet/dist/leaflet.css'`) - https://stackoverflow.com/questions/60296645/leaflet-map-not-rendering-tiles-properly
2. Install npm package `@types/node` if Typescript cannot import node packages (e.g. `import dns from "node:dns"`) - https://www.npmjs.com/package/@types/node
3. Rendering react components into non react dom nodes (for rendering JSX component to Leaflet map popup) - https://react.dev/reference/react-dom/createPortal#rendering-react-components-into-non-react-dom-nodes
4. Countries with their (ISO 3166-1) Alpha-2 code, Alpha-3 code, UN M49, average latitude and longitude coordinates - https://gist.github.com/tadast/8827699
5. Customizing Player Controls for Video JS - https://stackoverflow.com/questions/48715817/video-js-customizing-player-controls
6. Expand volume control by default (Video JS) - https://stackoverflow.com/questions/72654727/expand-volume-level-by-default
7. Media Audio Format Containers - https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Containers
8. E.g. converting CSV file to array of entries to create map

```javascript
import fs from "node:fs"
import Papa from "papaparse"

async function getCountryCoordinatesFromCsv() {
  // Countries with their (ISO 3166-1) Alpha-2 code, Alpha-3 code, UN M49, average latitude and longitude coordinates
  // https://gist.github.com/tadast/8827699
  // e.g CSV
  //   country,alpha2_code,alpha3_code,numeric_code,latitude_average,longitude_average
  // Afghanistan,AF,AFG,4,33,65
  const csvFile = fs.readFileSync("countryAverageCoordinates.csv", "utf8")
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      fastMode: true,
      error: (error) => {
        reject(error.message)
      },
      complete: function (results) {
        // latitude and longitude need to be converted from string to number
        const data = results.data.map((countryInfo) => {
          if (countryInfo["__parsed_extra"]) {
            console.error(countryInfo)
          }
          return [
            countryInfo["alpha2_code"],
            {
              latitude: parseFloat(countryInfo["latitude_average"]),
              longitude: parseFloat(countryInfo["longitude_average"]),
            },
          ]
        })
        // @ts-expect-error converting data to map using iterable [[key, value]]
        const map = new Map(data)
        resolve(map)
      },
    })
  })
}
```

9. How to access the clipboard contents using playwright in typescript - https://stackoverflow.com/questions/72265518/how-to-access-the-clipboard-contents-using-playwright-in-typescript
10. Validate for UUID V4 - https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
11. Mocking the Playwright Headers (for Rate Limit HTTP 429 testing) - https://github.com/microsoft/playwright/issues/19788

```typescript
//I found out what is wrong with our approach. We are not exposing the headers!

// While headers are visible within Playwright tests (because they are on the same server), once we want to see the headers in our app in the browser, we are actually in a CORS situation, in which we will only be able to see the exposed headers from the Playwright server (the mock acts like an external server)

// So, given I want to implement a mock route returning a status 429 with a retry-after header, this is how the mock request should look:

await page.route("*/**/api/podcast/trending?limit=10", async (route) => {
  await route.fulfill({
    status: 429,
    // retry-after headers are missing - https://github.com/microsoft/playwright/issues/19788
    headers: {
      "access-control-expose-headers": "retry-after",
      "retry-after": "2",
    },
    body: "Too many requests, please try again later.",
  })
})
```

12. Updating `browserslist` for `package-lock.json` - `npx update-browserslist-db@latest` - https://github.com/browserslist/update-db#readme
13. Waiting for an element to not be on a page in Playwright - `expect(page.locator("???")).toHaveCount(?))` - https://stackoverflow.com/questions/71183099/how-can-i-assert-that-an-element-is-not-on-the-page-in-playwright
14. Vite code splitting that works - https://sambitsahoo.com/blog/vite-code-splitting-that-works.html
15. Prevent stream from being loaded when player is closed - https://github.com/muxinc/media-elements/discussions/82
16. Reverse Scrolling Flickering/Jumping with Dynamic Heights - react-virtuoso (add explicit width and height values and change margin to padding) - https://github.com/petyosi/react-virtuoso/discussions/1083
17. Playwright test sharding - https://playwright.dev/docs/test-sharding#introduction

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react"

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
})
```
