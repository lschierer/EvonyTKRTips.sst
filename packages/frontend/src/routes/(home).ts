import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

export default defineRoute({
  document: (context) => document({ ...context, title: 'Evony TKR Tips' }),

  template: () => html`
    <!--  -->
    <h1>Evony TKR Tips</h1>
    <!--  -->
  `,
});
