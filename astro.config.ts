import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  site: 'https://evonytkrtips.net',
  integrations: [
    starlight({
      title: 'Evony TKR Site',
      sidebar: [
        {
          label: 'Generals',
          collapsed: true,
          autogenerate: {
            directory: 'generals',
            collapsed: true,
          },
        },
        {
          label: 'SvS',
          collapsed: true,
          autogenerate: {
            directory: 'svs',
            collapsed: true,
          },
        },
        {
          label: 'Reference',
          collapsed: true,
          autogenerate: {
            directory: 'reference'
          },
        },
      ],
    }),
    lit(),
  ],
  vite: {
    build: {
      minify: false
    },
  },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } }
});
