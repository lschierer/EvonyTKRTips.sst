import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import lit from "@astrojs/lit";

import {sidebar} from './src/sidebar.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://evonytkrtips.net',
  compressHTML: false,
  integrations: [
    lit(),
    starlightLinksValidator(),
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
      lastUpdated: true,
      pagination: true,
      sidebar: sidebar,
      social: {
        github: 'https://github.com/lschierer/EvonyTKRTips.sst',
      },
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
