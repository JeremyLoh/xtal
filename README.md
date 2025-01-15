# xtal

Listen to the world's radio with xtal, a fast and responsive mobile / desktop web application

- Discover music / radio stations available around the globe
  - Explore different genres of music
  - Search stations by filters
  - Add / Remove Favourite Stations

# Tech Stack

- TypeScript
- React
- Playwright (testing)

# Packages used (Frontend)

- Radio Browser - https://www.radio-browser.info/
- Leaflet (Map) - https://leafletjs.com/
- OpenStreetMap tiles (Tiles for map) - https://operations.osmfoundation.org/policies/tiles/
- sonner (Toasts) - https://sonner.emilkowal.ski/
- react-icons - https://react-icons.github.io/react-icons/
- ky (HTTP requests) - https://www.npmjs.com/package/ky
- react-hook-form - https://www.npmjs.com/package/react-hook-form

# Running Tests

1. Ensure `node` is installed on your system - https://nodejs.org/en
2. Navigate to the `frontend/` directory
3. Run `npm run test` (to launch Playwright UI) OR run `npx playwright test` to run tests in headless mode
