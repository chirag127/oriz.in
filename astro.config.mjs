import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

const site = process.env.PUBLIC_SITE_URL || "https://oriz.in";

export default defineConfig({
  site,
  output: "static",
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false
    }),
    sitemap()
  ]
});
