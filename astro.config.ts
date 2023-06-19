import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import aws from "astro-sst/lambda";
import node from '@astrojs/node';
import lit from "@astrojs/lit";
import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  site: 'https://evonytkrtips.net',
  integrations: [
    starlight({
      title: 'Evony TKR Site',
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Example Guide', link: '/guides/example/' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
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
