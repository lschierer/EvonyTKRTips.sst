import {html, css, LitElement, type CSSResultArray, type PropertyValueMap} from 'lit';
import {query} from 'lit/decorators/query.js';
import { state } from 'lit/decorators.js';


import {z} from 'zod';

import 'iconify-icon';

import { SpectrumElement } from '@spectrum-web-components/base';

import '@spectrum-web-components/top-nav/sp-top-nav.js';
import '@spectrum-web-components/top-nav/sp-top-nav-item.js';
import '@spectrum-web-components/field-group/sp-field-group.js';
import '@spectrum-web-components/icon/sp-icon.js';
import '@spectrum-web-components/action-menu/sync/sp-action-menu.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/theme/theme-dark.js';
import '@spectrum-web-components/theme/theme-light.js';

import { Theme as SPTheme, } from '@spectrum-web-components/theme';
import { type TopNav } from '@spectrum-web-components/top-nav';
import { Picker } from '@spectrum-web-components/picker';

export const tagName = 'top-nav';

const themeEnum = z.enum(['light', 'dark', 'auto'])
type themeSchema = z.infer<typeof themeEnum>;



export class SpectrumTopNav extends SpectrumElement {
  
  @state()
  private _themeValue: themeSchema = themeEnum.enum.light;

  @query('#themeSelect')
  _themePicker : Picker | undefined;

  private themeElement = document.querySelector('sp-theme');
  
  static #key = 'starlight-theme';
  
  constructor() {
    super();
  }
  
  private updateTheme = async (color: themeSchema) => {
    
    if(this.themeElement !== null) {
      const valid= themeEnum.safeParse(color);
      let newColor: 'light' | 'dark' = 'light';
      if(valid.success) {
        if(valid.data !== themeEnum.enum.auto) {
          newColor = valid.data;
        } else {
          const value = this.getPreferredColorScheme();
          //this cannot be auto, but typescript doesn't know that
          if(value !== themeEnum.enum.auto) {
            newColor = value;
          }
        }
        
      }
      (this.themeElement as SPTheme).color = newColor;
      (this.themeElement as SPTheme).scale = 'medium';
      document.documentElement.dataset.theme = newColor;
      if(this._themePicker !== undefined && this._themePicker !== null) {
        console.log(`picker new value is ${color}`)
        this._themeValue = color;
      }
    }
  }

  
  private getPreferredColorScheme(): themeSchema {
    const mm = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    console.log(`getPrefered found ${mm}`)
    return mm;
  }
    
  public override connectedCallback(): void {
    super.connectedCallback();
    const prefered = this.getPreferredColorScheme();
    if(prefered !== this._themeValue) {
      this.updateTheme(prefered);
      console.log(`connectedCallback set ${this._themeValue}`)
    }
  }
  public override firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    
  }
  

  public static override get styles(): CSSResultArray {
    const localstyle = css`
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
    if (super.styles !== null && super.styles !== undefined) {
      return [super.styles, localstyle];
    } else return [localstyle];
  }

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
                      value=${this._themeValue}
                      placement="bottom-end"
                      style="margin-inline-start: auto;"
                      @change=${(e: CustomEvent) => {this.updateTheme(((e.target as Picker).value as themeSchema)); console.log(`target has ${(e.target as Picker).value}`); this.requestUpdate();}}
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

