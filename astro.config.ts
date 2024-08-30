import { defineConfig } from 'astro/config';
import aws from "astro-sst";
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator'
import lit from "@astrojs/lit";

import tsconfigPaths from 'rollup-plugin-tsconfig-paths';

import * as path from 'path'; 
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {sidebar} from './src/sidebar.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://evonytkrtips.net',
  output: 'hybrid',
  adapter: aws(
    
  ),
  compressHTML: false,
  experimental: {
    globalRoutePriority: true,
  },
  integrations: [
    lit(),
    starlight({
      title: 'Evony TKR Tips',
      disable404Route: true,
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
        }),
      ],
      components: {
        PageFrame: './src/components/Spectrum/PageFrame.astro',
        Header: './src/components/Spectrum/TopNav.astro',
        Footer: './src/components/footer.astro',
      },
      customCss: [
	      '@spectrum-web-components/styles/typography.css',
        '@spectrum-web-components/styles/scale-medium.css',
        '@spectrum-css/tokens/dist/index.css',
        //'@spectrum-css/typography/dist/index.css',
        '@spectrum-css/vars/dist/spectrum-global.css',
        '@spectrum-css/vars/dist/spectrum-medium.css',
        //'@spectrum-css/page/dist/index.css',
        './src/styles/styles.css',
      ],
      head: [
        {
          tag: 'script',
          attrs: {
            src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8360834774752607",
            defer: true,
          }
        },
        {
          tag: 'meta',
          attrs: {
            name: "google-adsense-account",
            content: "ca-pub-8360834774752607",
          }
        }
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
    optimizeDeps: {
      needsInterop: [
        '@spectrum-css/typography',
        '@spectrum-css/page'
      ]
    },
    plugins: [
      tsconfigPaths({
        // specify the project's tsconfig.json, which configured paths mapping.
        tsConfigPath: path.join(dirname(fileURLToPath(import.meta.url)), './tsconfig.json')
      }),
    ],
  },

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
