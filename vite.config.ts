import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig(({ command }) => ({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    command === "build" ? netlify() : null,
    react(),
  ].filter(Boolean),
}));
