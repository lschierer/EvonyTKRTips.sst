import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import '../../src/ASComponents';
import '../../src/MarkDown';
import '../../src/mayor_table/index';

@customElement('mayor-main')
export class  MayorMain extends LitElement {

    @property()
    part1;

    render(){
        return html`
            <mark-down path="/generals/mayors/part1"></mark-down>
            <mayor-table CsvName="attack_mayors.csv"></mayor-table>
        `;
    }
}