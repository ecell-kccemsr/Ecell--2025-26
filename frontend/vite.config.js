import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 10000,
    strictPort: true,
    proxy: {
      "/api": {
        target: "https://kcecell-backend-api.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to:", req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from:",
              req.url,
              "Status:",
              proxyRes.statusCode
            );
          });
        },
      },
    },
    cors: true,
    allowedHosts: ["ecell-2025-26.onrender.com", ".onrender.com"],
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 10000,
    strictPort: true,
    allowedHosts: ["ecell-2025-26.onrender.com", ".onrender.com"],
  },
});
