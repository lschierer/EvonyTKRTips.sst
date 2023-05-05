import { defineConfig } from "astro/config";
import aws from "astro-sst/lambda";
import node from '@astrojs/node';
import lit from "@astrojs/lit";
import markdoc from "@astrojs/markdoc";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: 'https://beta.evonytkrtips.net',
  trailingSlash: 'ignore',
  output: "server",
  adapter: aws(),
  integrations: [
    markdoc({
      gfm: true,
    }),
    mdx({
      gfm: true,
    })
  ],
  vite: {
    build: {
      minify: false
    },
    ssr: {
      target: 'node',
      external: ['node:path', 'node:fs', 'path-scurry', 'stream']
    }
  }
});