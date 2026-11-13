# PlaceX Frontend

React, TypeScript, Tailwind CSS, React Router, Lucide, and Recharts client for the PlaceX placement management system.

## Run locally

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

`VITE_API_BASE_URL` defaults to `http://localhost:8080/api`. Start the Spring Boot backend, then paste its `PLACEX_ADMIN_TOKEN` in **Settings → Backend connection** and select **Connect and load MySQL records**. The token is held in session storage for the current tab.

When the API is unavailable or no token is configured, the app clearly labels the sample records as a browser-only development fallback. Edits in that mode are stored in localStorage and are not sent to MySQL. See the project [README](../README.md) for database setup, API details, and backend commands.
