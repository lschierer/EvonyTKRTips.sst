import { LitElement, html, PropertyValueMap } from 'lit'
import {until} from 'lit/directives/until.js';
import { DirectiveResult } from 'lit/directive.js';
import { customElement, query, state } from 'lit/decorators.js'
import { resolveMarkdown, MarkdownDirective } from "lit-markdown";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Bucket } from "sst/node/bucket";



/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('mark-down')
export class MarkDown extends LitElement {
  @query("textarea")
  private textarea!: HTMLTextAreaElement;

  @state()
  private raw = this.fetchFile();


  @state()
  private myPath = document.location.pathname;


  private parseMarkdown(incoming: string) {
    const value = incoming? incoming.trim() : "";
    console.log(`value was ${value}`);
    return resolveMarkdown(value, { includeImages: true, includeCodeBlockClassNames: true });
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
    let text = await fetch(fileUrl)
        .then((response) => response.text())
        .then((text) => {
          console.log(`text retrieved was ${text}`);
          return this.parseMarkdown( text);
          return text;
        });
    return text;
  }

  render() {
    return html`
      <div>
        ${until(this.raw, html`<span>Loading...</span>`)}
      </div>

    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mark-down': MarkDown
  }
}
