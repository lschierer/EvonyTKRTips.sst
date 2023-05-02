import { iterateSync } from 'glob';

export const prerender = true;

import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/sidenav/sp-sidenav.js';
import '@spectrum-web-components/sidenav/sp-sidenav-heading.js';
import '@spectrum-web-components/sidenav/sp-sidenav-item.js';

import * as Glob from 'glob';
import { PathScurry, Path } from 'path-scurry';
@customElement("side-nav")
class SideNav extends LitElement {

  private rootDir:string;

  constructor(){
    super();
    this.rootDir = import.meta.env.RootDir + "/src/pages/";
    console.log(`root set to ${this.rootDir}`);
  }

  private *readAllFiles(dir: string): Generator<Path> {
    const pw = new PathScurry(dir);

    for (const file of pw) {
      if (file.isDirectory()) {
        yield* this.readAllFiles(file.fullpath());
      } else {
        yield file;
      }
    }
  }

  render_entry(curpath:string){

    const content_dirs:Set<Path> = new Set();
    const pw = new PathScurry(this.rootDir);

    for (const file of this.readAllFiles(curpath)) {
      content_dirs.add(file);
    }

    content_dirs.forEach((d) =>{
      if(d.isDirectory()) {
        return html`
          <sp-sidenav-item value="${d.relative()}" label="${d.name}">
            ${this.render_entry(d.fullpath())}
          </sp-sidenav-item>
        `;
      } else {
        return html`
          <sp-sidenav-item value='${d.relative()}' label='${d.name}'></sp-sidenav-item>
        `;
      }
    });
    return html`<sp-sidenav-item value='${curpath}' label='${curpath.split('/').pop()}'></sp-sidenav-item>`;
  }
  render() {
    const req = Astro.request.url.pathname;
    const base = req.split('/')[1];
    console.log(`I think the base component is ${base}`);

    return html`
      <sp-sidenav variant="multilevel" defaultValue='${req}'>
        ${this.render_entry(this.rootDir)}
      </sp-sidenav>
    `;
  }


}

