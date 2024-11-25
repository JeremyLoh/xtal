# References

1. Leaflet Map, not rendering tiles properly (just include `import 'leaflet/dist/leaflet.css'`) - https://stackoverflow.com/questions/60296645/leaflet-map-not-rendering-tiles-properly
2. Install npm package `@types/node` if Typescript cannot import node packages (e.g. `import dns from "node:dns"`) - https://www.npmjs.com/package/@types/node
3. Rendering react components into non react dom nodes (for rendering JSX component to Leaflet map popup) - https://react.dev/reference/react-dom/createPortal#rendering-react-components-into-non-react-dom-nodes
4. Countries with their (ISO 3166-1) Alpha-2 code, Alpha-3 code, UN M49, average latitude and longitude coordinates - https://gist.github.com/tadast/8827699
5. Media Audio Format Containers - https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Containers
6. E.g. converting CSV file to array of entries to create map

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
