import { defineMarkdocConfig } from '@astrojs/markdoc/config';
import SPTable from './src/components/SPTable.astro';
import Banner from './src/components/Spectrum/Banner.astro';

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
    }
  },
})