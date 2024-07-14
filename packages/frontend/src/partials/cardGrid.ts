import { html } from '@gracile/gracile/server-html';
import { type ServerRenderedTemplate } from '@lit-labs/ssr';

export const cardGrid = (cards: ServerRenderedTemplate[]) => {
  return html`
    <div class="row row-cols-1 row-cols-md-2 g-4">
      ${cards.map((c) => {
        return html` <div class="col">${c}</div> `;
      })}
    </div>
  `;
};
