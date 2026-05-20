import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { handleTerraDotta } from "./api/terradotta.js";

// Dev-only middleware that mirrors the Vercel edge function so the same
// /api/terradotta endpoint works locally during `npm run dev`.
function terraDottaDevMiddleware() {
  return {
    name: "terradotta-dev",
    configureServer(server) {
      server.middlewares.use("/api/terradotta", async (req, res) => {
        try {
          const u = new URL(req.url, "http://localhost");
          const result = await handleTerraDotta(u.searchParams);
          res.statusCode = result.status;
          res.setHeader("content-type", "application/json");
          res.setHeader("access-control-allow-origin", "*");
          res.setHeader("cache-control", "public, max-age=86400");
          res.end(JSON.stringify(result.body));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), terraDottaDevMiddleware()],
  server: { port: 5173, open: true },
});
