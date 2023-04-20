import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import '../../src/ASComponents';
import '../../src/MarkDown';

@customElement('mayor-main')
export class  MayorMain extends LitElement {

    @property()
    part1;

    render(){
        return html`
            <mark-down path="/generals/mayors/part1"/>
        `;
    }
}