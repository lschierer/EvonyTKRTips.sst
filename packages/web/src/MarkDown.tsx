import { LitElement, html,PropertyValues  } from 'lit'
import {ifDefined} from 'lit/directives/if-defined.js';
import { customElement, property, state} from 'lit/decorators.js'
import {ZeroMD} from 'zero-md';


@customElement('mark-down')
export class MarkDown extends LitElement {

  @state()
  private raw: string;

  @property({type: String})
  path: string;

  @state()
  private myPath

  @state()
  private myURL: URL| undefined;

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
        let filename = "../public/en";
        if (this.myPath[this.myPath.length -1] === '/') {
          filename = filename.concat(this.myPath.concat("index.md"));
        } else {
          filename = filename.concat(this.myPath.concat(".md"));
        }
        console.log(`going to get ${filename}`);
        filename = filename.replace(/public\//,'');
        let fileUrl = new URL(filename, import.meta.url);
        console.log(`resulting url is ${fileUrl.href}`);
        this.myURL = fileUrl;
      }
    }
  }



  render() {
    if (this.myURL !== undefined) {
      return html`
        <zero-md src="${this.myURL}"></zero-md>
      `;
    } else {
      return html`<span>Loading....</span>`
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mark-down': MarkDown
  }
}
