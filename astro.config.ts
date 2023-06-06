import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import aws from "astro-sst/lambda";
import node from '@astrojs/node';
import lit from "@astrojs/lit";
import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  integrations: [
      starlight({
        title: 'Evony TKR Tips',
        sidebar: [
          {
            label: 'Generals',
            autogenerate: { directory: 'generals' },
          },
        ],
      }),
    markdoc(),
    lit(),
  ],
  vite: {
    build: {
      minify: false
    },
  }
});
