import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  site: 'https://evonytkrtips.net',
  integrations: [
    starlight({
      title: 'Evony TKR Tips',
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

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
