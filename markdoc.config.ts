import { defineMarkdocConfig } from '@astrojs/markdoc/config';
import SPTable from './src/components/SPTable.astro';

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
  },
})