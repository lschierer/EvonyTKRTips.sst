import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import lit from "@astrojs/lit";

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
          label: 'Monsters',
          collapsed: true,
          items: [
            {
              label: 'About Monsters',
              link: 'monsters/',

            },
            {
              label: 'Getting Started',
              link: 'monsters/getting_started/',
            },
            {
              label: 'Boss Monster Overview',
              link: 'monsters/boss_overview/',
            },
            {
              label: 'Reports',
              collapsed: true,
              autogenerate: {
                directory: 'monsters/legacyReports',
                collapsed: true,
              },
            },
          ]
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
  ],
  vite: {
    build: {
      minify: false
    },
  },

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
