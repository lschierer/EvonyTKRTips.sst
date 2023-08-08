import { defineMarkdocConfig } from '@astrojs/markdoc/config';
import SPTable from './src/components/SPTable.astro';
import Banner from './src/components/Spectrum/Banner.astro';
import Card from './src/components/Spectrum/Card.astro';
import h_flexbox from './src/components/HFlexBox.astro';

export default defineMarkdocConfig({
  tags: {
    sptable: {
      render: SPTable,
      attributes: {
        csv: {
          type: String,
        }
      }
    },
    banner: {
      render: Banner,
      attributes: {
        type: String,
        header: String,
      }
    },
    card: {
      render: Card,
      attributes: {
        heading: String,
        subheading: String,
        img: String,
        alt: String,
      }
    },
    h_flex:{
      render: h_flexbox,
    }
  },
})