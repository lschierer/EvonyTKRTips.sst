import {html, css, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {query} from 'lit/decorators/query.js';
import {ref} from 'lit/directives/ref.js';
import {styleMap} from 'lit/directives/style-map.js';

import {z} from 'zod';

import 'iconify-icon';

import '@spectrum-web-components/top-nav/sp-top-nav.js';
import '@spectrum-web-components/top-nav/sp-top-nav-item.js';
import '@spectrum-web-components/icon/sp-icon.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/picker/sp-picker.js';

import { Theme as SPTheme, type Color} from '@spectrum-web-components/theme';
import { type TopNav } from '@spectrum-web-components/top-nav';
import { Picker } from '@spectrum-web-components/picker';

export const tagName = 'top-nav';

const themeEnum = z.enum(['light', 'dark', 'auto'])
type themeSchema = z.infer<typeof themeEnum>;

@customElement('top-nav')
export class SpectrumTopNav extends LitElement {
  
  @query('#themeSelect')
  _themePicker : Picker | undefined;
  
  static #key = 'starlight-theme';
  
  constructor() {
    super();
  }
  
  private getPreferredColorScheme(): themeSchema {
    return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  
  private setTheme(newTheme: themeSchema | Event) {
    console.log(`setTheme called`)
    const validate = themeEnum.safeParse(newTheme);
    let toSet = 'auto';
    if(validate.success) {
      toSet = validate.data;
    } else {
      const _event = (newTheme as Event);
      toSet = (_event.target as Picker).value;
      console.log(`getting value from Event, ${toSet}`)
    }
    if(this._themePicker !== null && this._themePicker !== undefined) {
      console.log(`and picker was not null, theme is ${toSet}`)
      this._themePicker.value = toSet;
      const themeElement = document.querySelector('sp-theme');
      if(themeElement !== null && themeElement !== undefined) {
        const key = toSet === 'auto' ? this.getPreferredColorScheme() : toSet;
        if(key === 'light') {
          (themeElement as SPTheme).color = "light";
        }
        if(key === 'dark') {
          (themeElement as SPTheme).color = "dark";
        }
      }
      document.documentElement.dataset.theme =
        toSet === 'auto' ? this.getPreferredColorScheme() : toSet;
      if (typeof localStorage !== 'undefined') {
        if (toSet === 'light' || toSet === 'dark') {
          localStorage.setItem(SpectrumTopNav.#key, toSet);
        } else {
          localStorage.removeItem(SpectrumTopNav.#key);
        }
      }
    }
  }
  
  public updatePickers(target?: Element) {
    console.log(`updatePickers;`)
    const windowPref = this.getPreferredColorScheme();
    if(target !== null && target !== undefined) {
      const picker = (target as Picker);
      let theme = 'light';
      if(picker.value === null || picker.value === undefined || picker.value === '') {
        this.setTheme('auto');
        theme = windowPref;
      } else {
        theme = picker ? picker.value ? picker.value : windowPref : windowPref;
      }
      
    }
  }
  
  static styles = css`
    sp-top-nav {
      background-color: var(--spectrum-cyan-600);
      
    }
    :host {
      width: 100%;
      height: 100%
    }
  `
  override render(){
    
    return html`
            <sp-top-nav size="xl" client:load >
                <sp-top-nav-item></sp-top-nav-item>
                <sp-top-nav-item href="/"><strong>Evony TKR Tips</strong></sp-top-nav-item>
                <sp-top-nav-item href="/generals/" style="margin-inline-start: auto;">Generals</sp-top-nav-item>
                <sp-top-nav-item href="/monsters/">Monsters</sp-top-nav-item>
                <sp-top-nav-item href="/svs/">SvS</sp-top-nav-item>
                <sp-top-nav-item href="/reference/">Reference</sp-top-nav-item>
                <sp-picker
                        ${ref(this.updatePickers)}
                        id="themeSelect"
                        size="xs"
                        label="" quiet
                        value="auto"
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
                </sp-picker>
                
                <sp-top-nav-item></sp-top-nav-item>
            </sp-top-nav>
        `
  }
}

type Theme = 'auto' | 'dark' | 'light';

