// import path from "path";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });

// import path from "path";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     port: 5174,
//     open: true,
//     historyApiFallback: true,
//     hmr: {
//       overlay: false, // Disable the HMR error overlay
//     },
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000", // For local development
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   build: {
//     outDir: "dist",
//   },
//   define: {
//     "process.env.VITE_API_URL": JSON.stringify(
//       process.env.VITE_API_URL || "http://localhost:5000"
//     ), // Fallback for local dev
//   },
// });

import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    open: true,
    historyApiFallback: true,
    hmr: {
      overlay: false, // Disable the HMR error overlay
    },
    proxy: {
      "/api": {
        target:
          process.env.NODE_ENV === "production"
            ? "https://lms-c3nt.onrender.com"
            : "http://localhost:5000", // Use production URL in production, localhost in development
        changeOrigin: true,
        secure: process.env.NODE_ENV === "production", // Enable secure for production
      },
    },
  },
  build: {
    outDir: "dist",
  },
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL ||
        (process.env.NODE_ENV === "production"
          ? "https://lms-c3nt.onrender.com"
          : "http://localhost:5000")
    ), // Set VITE_API_URL based on environment
  },
});
