import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../../layouts/base/document';

export default defineRoute({
  document: (context) =>
    document({ ...context, title: 'Evony TKR Tips: Generals' }),

  template: () => html`
    <!--  -->
    <div class="container py-4 px-3 mx-auto">
      <h1>Evony TKR Tips: Generals</h1>
    </div>
    <!--  -->
  `,
});
