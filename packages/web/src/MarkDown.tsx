import { LitElement, html,PropertyValues  } from 'lit'
import {when} from 'lit/directives/when.js';
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

  @state()
  private _parsed: boolean;

  constructor() {
    super();
    this._parsed = false;
    this.path = "";
    this.myPath = document.location.pathname;
    console.log(`in constuctor, path is ${this.myPath}`)
    this.raw = "";
  }


  async willUpdate(changedProperties: PropertyValues<this>) {
    // only need to check changed properties for an expensive computation.
    if (changedProperties.has('path')) {
      console.log(`path change detected: ${this.path}`);
      if(this.path.length > 1) {
        this.myPath = this.path;
      }
      this.raw = (await this.fetchFile() as MarkdownDirective);

    }
  }

  private parseMarkdown(incoming: string) {
    const value = incoming? incoming.trim() : "";
    console.log(`value was ${value}`);
    let result = resolveMarkdown(value, { skipSanitization: true });
    this._parsed = true;
    this.raw = (result as MarkdownDirective);
    return result;
  }

  private async fetchFile() {
    let filename = "../public/en";
    if (this.myPath[this.myPath.length -1] === '/') {
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
        ${when(this._parsed, () => html`${this.raw}`)}
      </div>

    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mark-down': MarkDown
  }
}
