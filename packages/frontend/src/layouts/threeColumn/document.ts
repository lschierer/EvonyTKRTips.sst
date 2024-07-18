import { helpers } from '@gracile/gracile/document';
import { html } from '@gracile/gracile/server-html';
import { ifDefined } from 'lit/directives/if-defined.js';
import { type ServerRenderedTemplate } from '@lit-labs/ssr';
import { navbar } from '../../partials/navbar';
import { nothing } from 'lit';

export const document = (options: {
  url: URL;
  title?: string;
  toc?: ServerRenderedTemplate;
}) => html`
  <!doctype html>
  <html lang="en">
    <head>
      <!-- Helpers -->
      ${Object.values(helpers.dev)}
      <!--  -->
      ${helpers.fullHydration}
      <!--  -->
      ${Object.values(helpers.polyfills)}

      <!-- Global assets -->
      <link
        rel="stylesheet"
        href=${new URL('./document.css', import.meta.url).pathname}
      />
      <script
        type="module"
        src=${new URL('./document.client.ts', import.meta.url).pathname}
      ></script>

      <!-- Page assets -->
      ${helpers.pageAssets}

      <!-- SEO and page metadata -->
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>
        Evony TKR Tips${options.title ? `: ${options.title}` : nothing}
      </title>
    </head>

    <body>
      ${navbar(options.url.pathname.split('/').slice(-2, -1)[0] ?? '/')}
      <div class="container text-center">
        <div class="row">
          <div id="sidebar" class="col-1">
            <!-- sidebar will go here -->
          </div>
          <div id="main" class="col-md-auto">
            <route-template-outlet></route-template-outlet>
          </div>
          <div id="toc" class="col-1">
            <!-- page-specific ToC will go here -->
            ${ifDefined(options.toc)}
          </div>
        </div>
      </div>
    </body>
  </html>
`;