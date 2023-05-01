import { defineConfig } from "astro/config";
import aws from "astro-sst/lambda";
import lit from "@astrojs/lit";

import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  site: 'https://beta.evonytkrtips.net',
  trailingSlash: 'ignore',
  output: "server",
  adapter: aws(),
  integrations: [lit(), markdoc()]
});