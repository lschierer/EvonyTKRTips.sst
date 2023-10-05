import { defineConfig } from "astro/config";
import aws from "astro-sst/lambda";
import mdx from '@astrojs/mdx';
import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  site: 'https://evonytkrtips.net',
  output: "server",
  adapter: aws(),
  integrations: [
    mdx(),
    lit(),
  ],
  vite: {
    build: {
      minify: false
    },
  }
});
