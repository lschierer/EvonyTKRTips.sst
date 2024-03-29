import {html, css, LitElement} from 'lit';
import {query} from 'lit/decorators/query.js';

import {z} from 'zod';

import 'iconify-icon';

import '@spectrum-web-components/top-nav/sp-top-nav.js';
import '@spectrum-web-components/top-nav/sp-top-nav-item.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/icon/sp-icon.js';
import '@spectrum-web-components/action-menu/sync/sp-action-menu.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/picker/sp-picker.js';

import { Theme as SPTheme, } from '@spectrum-web-components/theme';
import { type TopNav } from '@spectrum-web-components/top-nav';
import { Picker } from '@spectrum-web-components/picker';

export const tagName = 'top-nav';

const themeEnum = z.enum(['light', 'dark', 'auto'])
type themeSchema = z.infer<typeof themeEnum>;

export class SpectrumTopNav extends LitElement {
  
  @query('#themeSelect')
  _themePicker : Picker | undefined;
  
  static #key = 'starlight-theme';
  
  constructor() {
    super();
  }
  
  private loadTheme() {
    const theme = typeof localStorage !== 'undefined' && localStorage.getItem(SpectrumTopNav.#key);
    const validate = themeEnum.safeParse(theme);
    if(validate.success) {
      this.setTheme(validate.data);
    } else {
      this.setTheme('auto')
    }
  }
  
  private getPreferredColorScheme(): themeSchema {
    const mm = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    return mm;
  }
  
  private setTheme(newTheme: themeSchema | Event) {
    const validate = themeEnum.safeParse(newTheme);
    let toSet: themeSchema = 'auto';
    if(validate.success) {
      toSet = validate.data;
    } else {
      const _event = (newTheme as Event);
      const v = (_event.target as Picker).value;
      const valid  = themeEnum.safeParse(v)
      if(valid.success) {
        toSet = valid.data;
      }
    }
    toSet = toSet === 'auto' ? this.getPreferredColorScheme() : toSet;
    if(this._themePicker !== null && this._themePicker !== undefined) {
      this._themePicker.value = toSet;
      const themeElement = document.querySelector('sp-theme');
      if(themeElement !== null && themeElement !== undefined) {
        if(toSet === 'light') {
          (themeElement as SPTheme).color = "light";
        }
        if(toSet === 'dark') {
          (themeElement as SPTheme).color = "dark";
        }
      }
      document.documentElement.dataset.theme = toSet;
      this.updatePickers(toSet);
      if (typeof localStorage !== 'undefined') {
        if (toSet === 'light' || toSet === 'dark') {
          localStorage.setItem(SpectrumTopNav.#key, toSet);
        } else {
          localStorage.removeItem(SpectrumTopNav.#key);
        }
      }
    }
  }
  
  public updatePickers(nv: themeSchema) {
    const windowPref = this.getPreferredColorScheme();
    if(this._themePicker !== null && this._themePicker !== undefined) {
      if(nv === 'auto') {
        this._themePicker.value=windowPref;
      } else {
        this._themePicker.value = nv;
      }
    }
  }
  
  firstUpdated() {
    this.loadTheme();
  }
  
  static styles = css`
    :root {
      --flex-end: flex-end;
    }
    
    sp-top-nav {
      background-color: var(--spectrum-cyan-600);
      
    }
    sp-action-menu {
      margin-right: 1rem;
      margin-left: 1rem;
      
      align-self: center;
    }
    sp-field-group#left {
      flex: 0 0; 
      flex-direction: row; 
      align-items: center; 
      justify-content: flex-end;
      min-width: fit-content;
    }
    
    
    sp-top-nav-item {
      margin-right: 1rem;
      margin-left: 1rem;
    }
    sp-top-nav-item#home {
      flex-grow: 1;
    }
    :host {
      width: 100%;
      height: 100%
    }
  `
  override render(){
    
    return html`
            <sp-top-nav size="xl" client:load >
              <sp-top-nav-item id="home" href="/"><strong>Evony TKR Tips</strong></sp-top-nav-item>
              
                <sp-top-nav-item href="/generals/" style="margin-inline-start: auto;">Generals</sp-top-nav-item>
                <sp-top-nav-item href="/monsters/">Monsters</sp-top-nav-item>
                <sp-top-nav-item href="/svs/">SvS</sp-top-nav-item>
                <sp-top-nav-item href="/reference/">Reference</sp-top-nav-item>
                <sp-field-group id="left" horizontal class="non-content" >
                  <sp-top-nav-item href="https://github.com/lschierer/EvonyTKRTips.sst"  style="align-items: center; justify-content: flex-end">
                    <iconify-icon icon="codicon:github" style="font-size: 25px; "></iconify-icon>
                  </sp-top-nav-item>
                  <sp-action-menu
                      id="themeSelect"
                      size="s"
                      label="" quiet
                      value=""
                      placement="bottom-end"
                      style="margin-inline-start: auto;"
                      @change="${this.setTheme}"
                  >
                    <sp-menu-item value="light">
                      <iconify-icon icon="ph:sun-light" slot="icon"></iconify-icon>
                      Light
                    </sp-menu-item>
                    <sp-menu-item value="dark">
                      <iconify-icon icon="ph:moon-fill" slot="icon"></iconify-icon>
                      Dark
                    </sp-menu-item>
                    <sp-menu-item value="auto">
                      <iconify-icon icon="ph:laptop-duotone" slot="icon"></iconify-icon>
                      Auto
                    </sp-menu-item>
                  </sp-action-menu>
                </sp-field-group>
            </sp-top-nav>
        `
  }
}
customElements.define('top-nav', SpectrumTopNav);

