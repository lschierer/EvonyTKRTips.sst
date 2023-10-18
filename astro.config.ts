import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import lit from "@astrojs/lit";

import {sidebar} from './src/sidebar.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://evonytkrtips.net',
  compressHTML: false,
  integrations: [
    lit(),
    starlight({
      title: 'Evony TKR Tips',
      components: {
        // Override the default `SocialLinks` component.
        PageFrame: './src/components/Spectrum/PageFrame.astro',
        Header: './src/components/Spectrum/TopNav.astro',
      },
      customCss: [
        './src/styles/styles.css',
      ],
      sidebar: sidebar,
    }),
    {
      name: "sidebar-watch",
      hooks: {
        "astro:config:setup": ({ addWatchFile, config }) => {
          addWatchFile(new URL("./src/sidebar.ts", config.root));
        },
      },
    },
  ],
  vite: {
    build: {
      minify: false,
      cssMinify: false,
    },
  },

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
