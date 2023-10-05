import { defineConfig } from "astro/config";
import aws from "astro-sst/lambda";
import node from '@astrojs/node';
import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  site: 'https://beta.evonytkrtips.net',
  trailingSlash: 'ignore',
  output: "server",
  adapter: aws(),
  integrations: [
    lit(),
  ],
  vite: {
    build: {
      minify: false
    },
  }
});
