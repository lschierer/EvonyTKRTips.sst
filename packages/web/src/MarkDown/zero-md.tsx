import {html} from 'lit';
import { customElement, property } from "lit/decorators.js";

//partly per https://zerodevx.github.io/zero-md/configuration/
import * as ZeroMD from 'zero-md';

// Define a new custom class
@customElement('mark-down')
export class ZeroMdCustom extends LitElement {

  @property()
  public src: string;

  constructor() {
    this.src ="";
  }
  render(){
    return html`
      <zero-md src="${this.src}">
        <link rel="stylesheet" href="./markdown.css" />
        <link rel="stylesheet" href="./highlight.css" />
      </zero-md>
    `;
  }

}
