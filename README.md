# xtal

Listen to the world's radio with xtal, a fast and responsive mobile / desktop web application

# Features

- Discover music / radio stations available around the globe
  - Explore different genres of music
  - Search stations by filters
  - Add / Remove Favourite Stations
  - Share a radio station using a link

# Built With

- TypeScript
- React
- Playwright (end-to-end testing)

## Packages used (Frontend)

- Radio Browser - https://www.radio-browser.info/
- Leaflet (Map) - https://leafletjs.com/
- OpenStreetMap tiles (Tiles for map) - https://operations.osmfoundation.org/policies/tiles/
- sonner (Toasts) - https://sonner.emilkowal.ski/
- react-icons - https://react-icons.github.io/react-icons/
- ky (HTTP requests) - https://www.npmjs.com/package/ky
- react-hook-form - https://www.npmjs.com/package/react-hook-form
- React Router - https://reactrouter.com/
- Video.js - https://videojs.com/

# Setup

Clone the repository and run `npm install` in the respective folder (e.g. `frontend/`) to install the required dependencies

## Running Frontend Tests

The Frontend end-to-end tests are written in Playwright - https://playwright.dev/docs/writing-tests

1. Ensure `node` is installed on your system - https://nodejs.org/en
2. Navigate to the `frontend/` directory
3. Create a `.env.production` and `.env.local` file - https://vite.dev/guide/env-and-mode#env-files

   - e.g. `.env.local`

   ```
   VITE_MAX_FAVOURITE_STATIONS_ANONYMOUS=3
   VITE_BACKEND_ORIGIN="http://localhost:3000"
   ```

4. Install the required dependencies using `npm install`
5. Run `npm run test` (to launch Playwright UI) OR run `npx playwright test` to run tests in headless mode

## Running Backend Tests

The Backend tests are written in vitest - https://vitest.dev/

1. Ensure `node` is installed on your system - https://nodejs.org/en
2. Navigate to the `backend/` directory
3. Create a `.env` file with the following values:

   ```
   PORT=3000
   PODCAST_INDEX_API_KEY="???"
   PODCAST_INDEX_API_SECRET="???"
   FRONTEND_ORIGIN="http://localhost:5173"
   ENABLE_PROXY_TROUBLESHOOTING="false"
   ```

   - The `PODCAST_INDEX_API_KEY` and `PODCAST_INDEX_API_SECRET` are obtained from creating a developer account on https://api.podcastindex.org/signup

4. Install the required dependencies using `npm install`
5. Run `npm run test`

# Found a bug?

- Please submit an issue using the issues tab above with the following information:
  - Replication Steps (with screenshots if required)
  - Expected Result
  - Actual Result

# Known Issues

- Not Available

# Like this project?

If you are feeling generous, consider buying me a coffee! - https://ko-fi.com/jeremy_loh
