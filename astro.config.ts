import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import lit from "@astrojs/lit";
import { sidebar } from './src/sidebar.ts';
import circleDependency from 'vite-plugin-circular-dependency'

import aws from "astro-sst";

// https://astro.build/config
export default defineConfig({
  site: 'https://evonytkrtips.net',
  output: "hybrid",
  adapter: aws({
    //responseMode: "stream",
  }),
  devToolbar: {
    enabled: false
  },
  redirects: {
    '/generals/pair-picking/cavalry/': '/generals/pair-picking/mounted/',
    '/generals/pair-picking/monster-hunters/': '/generals/pair-picking/monsters/',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'tap',
  },
  compressHTML: false,
  integrations: [lit(), starlight({
    title: 'Evony TKR Tips',
    disable404Route: true,
    pagefind: false,
    plugins: [starlightLinksValidator({
      errorOnRelativeLinks: false
    })],
    components: {
      PageFrame: './src/components/Spectrum/PageFrame.astro',
      ThemeProvider: './src/components/Spectrum/ThemeProvider.astro',
      TwoColumnContent: './src/components/TwoColumnContent.astro',
      Sidebar: './src/components/Sidebar.astro'
    },
    customCss: [
      '@spectrum-web-components/styles/typography.css',
      '@spectrum-web-components/styles/scale-medium.css',
      '@spectrum-css/tokens/dist/index.css',
      '@spectrum-css/vars/dist/spectrum-global.css',
      '@spectrum-css/vars/dist/spectrum-medium.css',
      '@spectrum-css/page/dist/index.css',
      'tabulator-tables/dist/css/tabulator.min.css',
      './src/styles/custom.css'
    ],
    head: [{
      tag: 'script',
      attrs: {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8360834774752607",
        defer: true
      }
    }, {
      tag: 'meta',
      attrs: {
        name: "google-adsense-account",
        content: "ca-pub-8360834774752607"
      }
    }],
    lastUpdated: true,
    pagination: true,
    sidebar: sidebar,
    social: {
      github: 'https://github.com/lschierer/EvonyTKRTips.sst'
    }
  }), {
    name: "sidebar-watch",
    hooks: {
      "astro:config:setup": ({
        addWatchFile,
        config
      }) => {
        addWatchFile(new URL("./src/sidebar.ts", config.root));
      }
    }
  }],
  vite: {
    build: {
      minify: false,
      cssMinify: false
    },
    plugins: [
      circleDependency({
        outputFilePath: './circular-deps.txt',
        circleImportThrowErr: true,
        include: [
          /\.[jt]sx?$/, /\.astro\??/
        ]
      })
    ]
  },
  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});