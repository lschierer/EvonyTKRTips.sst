import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';


import '@spectrum-web-components/theme/sp-theme.js';
import './spectrum/TopNav';


@customElement('evony-tips')
export class EvonyTips extends LitElement {

  render() {
    return html`
      <sp-theme theme="classic" color="light" scale="medium">
        <div>
          <top-nav
            style='width: 100%;'
          ></top-nav>
        </div>
        <main>
          <h3>Tips For Budget Gamers</h3>
        </main>
      </sp-theme>
    `;
  }
}
