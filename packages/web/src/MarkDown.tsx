import { LitElement, html,PropertyValues  } from 'lit'
import {asyncReplace} from 'lit/directives/async-replace.js';
import { DirectiveClass } from 'lit/directive.js';
import { getDirectiveClass } from 'lit/directive-helpers.js';
import { customElement, property, state} from 'lit/decorators.js'
import { resolveMarkdown, MarkdownDirective } from "lit-markdown";



/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('mark-down')
export class MarkDown extends LitElement {

  @state()
  private raw: MarkdownDirective|string;

  @property({type: String})
  path: string;

  @state()
  private myPath

  constructor() {
    super();
    this.myPath = this.path ? this.path : document.location.pathname;
    console.log(`in constuctor, path is ${this.myPath}`)
    this.raw = "";
  }

  protected async willUpdate(_changedProperties: PropertyValues<this>) {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has('path')){
      console.log('detected changed path');
      this.myPath = this.path;
      this.raw = await this.fetchFile();
    }
  }

  private parseMarkdown(incoming: string) {
    const value = incoming? incoming.trim() : "";
    console.log(`value was ${value}`);
    return resolveMarkdown(value, { skipSanitization: true });
  }

  private async fetchFile() {
    if ((this.myPath === undefined) || (this.myPath === "")) {
      console.log("no path defined");
      console.log(`location is ${document.location.pathname}`);
      if (typeof (document.location.pathname) === "string") {
        this.myPath = document.location.pathname;
      }
    }
    let filename = "../public/en";
    if (this.myPath.at(-1) === '/') {
      filename = filename.concat(this.myPath.concat("index.md"));
    } else {
      filename = filename.concat(this.myPath.concat(".md"));
    }
    console.log(`going to get ${filename}`);
    let fileUrl = new URL(filename, import.meta.url).href;
    fileUrl = fileUrl.replace(/public\//,'');
    console.log(`resulting url is ${fileUrl}`);
    let _text = await fetch(fileUrl)
        .then((response) => response.text())
        .then((t) => {
          console.log(`text retrieved was ${t}`);
          return this.parseMarkdown( t);
        });
    return _text;
  }

  render() {
    return html`
      <div>
        ${asyncReplace(this.raw)}
      </div>

    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mark-down': MarkDown
  }
}
