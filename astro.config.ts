import { defineConfig } from "astro/config";
import aws from "astro-sst/lambda";
import node from '@astrojs/node';
import lit from "@astrojs/lit";
import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  site: 'https://evonytkrtips.net',
  output: "server",
  adapter: aws(),
  integrations: [
    markdoc(),
    lit(),
  ],
  vite: {
    build: {
      minify: false
    },
  }
});
