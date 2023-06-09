import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/top-nav/sp-top-nav.js';
import '@spectrum-web-components/top-nav/sp-top-nav-item.js';
import { TopNav } from '@spectrum-web-components/top-nav';


@customElement('top-nav')
export class myTopNav extends LitElement {

  override render(){
    return html`
            <sp-top-nav size="xl" >
                <sp-top-nav-item></sp-top-nav-item>
                <sp-top-nav-item href="/"><strong>Evony TKR Tips</strong></sp-top-nav-item>
                <sp-top-nav-item href="/generals/" style="margin-inline-start: auto;">Generals</sp-top-nav-item>
                <sp-top-nav-item href="/monsters/">Monsters</sp-top-nav-item>
                <sp-top-nav-item href="/svs/">SvS</sp-top-nav-item>
                <sp-top-nav-item href="/reference/">Reference</sp-top-nav-item>
                <sp-top-nav-item></sp-top-nav-item>
            </sp-top-nav>
        `
  }
}
