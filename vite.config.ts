import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Local same-origin proxy matching Azure `/api/visits`. */
function visitorCounterProxy(): Plugin {
  return {
    name: "visitor-counter-proxy",
    configureServer(server) {
      server.middlewares.use("/api/visits", async (req, res) => {
        try {
          const url = new URL(req.url || "/", "http://localhost");
          const increment = url.searchParams.get("inc") !== "0";
          const target = increment
            ? "https://api.counterapi.dev/v1/ivarajakovil/visits/up/"
            : "https://api.counterapi.dev/v1/ivarajakovil/visits/";

          const upstream = await fetch(target, {
            headers: { Accept: "application/json" },
          });
          const data = (await upstream.json()) as {
            count?: number;
            value?: number;
          };
          const count = Number(data.count ?? data.value ?? 0);

          res.statusCode = upstream.ok ? 200 : 502;
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Cache-Control", "no-store");
          res.end(JSON.stringify({ count: Number.isFinite(count) ? count : 0 }));
        } catch (err) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: err instanceof Error ? err.message : "proxy failed",
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), visitorCounterProxy()],
});
