# SimBrief METAR Viewer

Single-page React app (Vite + TypeScript) that fetches a SimBrief flight plan and shows METARs for departure and destination in a high-contrast, glassmorphic layout. Alternates can be toggled on with a dedicated button.

## Setup
1. Install Node.js (tested with 18+).
2. Install deps:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

## Tests
```bash
npm test
```

## Config
- User ID is set in `src/api/simbrief.ts` (`USER_ID = "1149288"`). Change if needed.
- Uses manual refresh only; on fetch error, an error screen is shown with retry.

## Sample Data
- `sample.xml` in the repo root is the captured SimBrief response used to understand the schema. The app fetches live data from SimBrief at runtime.
