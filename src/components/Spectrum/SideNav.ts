import type { CollectionEntry } from 'astro:content';
import { z, defineCollection } from 'astro:content';


import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/sidenav/sp-sidenav.js';
import '@spectrum-web-components/sidenav/sp-sidenav-heading.js';
import '@spectrum-web-components/sidenav/sp-sidenav-item.js';

@customElement("side-nav")
class SideNav extends LitElement {

  @property()
  public entries: CollectionEntry<'docs'>[] | null;

  @property()
  public selection: string | null;

  constructor(){
    super();

    this.entries = null;
    this.selection = null;
  }
  render_entry(){
    if(this.entries) {
        this.entries.forEach((e) => {
           const slug = e.slug.toString();
           if(slug.includes('/')){
               const base = slug.split('/').pop();
               const dir = slug.split('/').pop();
               return html`
                   <sp-sidenav-item value="${dir}" label="${dir}" expanded>
                       <sp-sidenav-item value="${e.slug.toString()}" label="${e.data.title}" href="${e.slug.toString()}"></sp-sidenav-item>
                   </sp-sidenav-item>
               `
           } else {
               return html`
                   <sp-sidenav-item value="${e.slug.toString()}" label="${e.data.title}" href="${e.slug.toString()}"></sp-sidenav-item>
               `
           }
        });
    }
    return html`<sp-sidenav-item value="/" label="/" href="/"></sp-sidenav-item>`;

  }
  render() {
    console.log(`in render, selection is ${this.selection}`)
    return html`
      <sp-sidenav variant="multilevel" defaultValue="${this.selection}" client:load>
        ${this.render_entry()}
      </sp-sidenav>
    `;
  }


}

