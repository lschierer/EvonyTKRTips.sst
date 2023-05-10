import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {ref,createRef} from 'lit/directives/ref.js';
import type {TemplateResult} from "@spectrum-web-components/base";

import * as d3select from 'd3-selection';

export type entry = {
    slug: string,
    title: string,
};

export interface props {
    entries: entry[],
}
@customElement('sp-nm')
export class SpNavMenu extends LitElement {

    @property()
    public items: entry[] | string;

    private _entries: Map<string>;

    private _directories: string[];

    @state()
    private items_size: number;

    @state()
    private selection: string;

    @state()
    private itemsTemplates: TemplateResult[];

    navRef:Ref<HTMLInputElement> = createRef();

    static styles = css`
        sp-sidenav: {
          flex: 1 1 auto;
          min-height: 1px;
          height: 90vh;
          min-width: 1px;
          width: 100%;
        }
    `;

    constructor(props) {
        super(props);

        this.itemsTemplates = [];
        this._entries = new Map();
        this.items_size = 0;
        this.selection = '';
    }


    connectedCallback() {
        super.connectedCallback();
        console.log(`ccb type of items is ${typeof(this.items)}`)
        if(typeof(this.items) === 'string') {
            console.log(`items is a string ${this.items}`)
            this.items = JSON.parse(this.items)
        }

        console.log(`ccb type of items is ${typeof(this.items)}`)

        this.items_size = this.items.length;
        console.log(`now showing ${this.items_size}`)

        this.requestUpdate();
    }

    protected renderItem(dirstack: string[], item: entry){
        let table = this.navRef;
        const slot = this.shadowRoot.querySelector('slot');
        let children = null;
        if(slot) {
            children = slot.assignedElements({flatten: true});
        }

        let itemsTemplates: TemplateResult[] = [];
        let a = item.slug.split('/');
        let b = a.shift();
        let s = a.join('/');
        if (s.at(0) === '/') {
            s = s.substring(1);
        }
        if(s.includes('/')){
            console.log(`ri / in ${s}`)
            let a2 = s.split('/');
            let b2 = a2.shift();

            if(!children){
                console.log(`made it to not children with base ${b2}`)
                let new_i = {
                    slug: a2.join('/'),
                    title: item.title
                }
                let d = dirstack.concat([b,b2]);
                return html`
                    <sp-sidenav-heading value=${b2} label=${b2} >
                        ${itemsTemplates.push(this.renderItem(d,new_i))}
                    </sp-sidenav-heading>
                `
            } else {
                console.log(`there are children`)
            }
        } else {
            console.log(`ri there was no /`)
            console.log(`dirstack is ${dirstack}`)
            let u = dirstack.flat().join('/') + s;
            console.log(`u is ${u} t is ${item.title}`)
            return html`
                <sp-sidenav-item value=${b} label=${item.title} href=${u}></sp-sidenav-item>
                `
        }
    }
    protected renderItems(table: Element | undefined) {
        let itemsTemplates: TemplateResult[] = [];
        let slot = this.shadowRoot.querySelector('slot');
        let children = null;
        if(slot) {
            children = slot.assignedElements({flatten: true});
        }
        if(this.items_size) {
            if(this.items === undefined) {
                return;
            } else {
                console.log(`type of items is ${typeof(this.items)}`)
            }
            this.items.forEach((item) => {
                if(item.slug.at(0) === '/') {
                    item.slug = item.slug.substring(1);
                }
                if(item.slug.includes('/')){
                    console.log(`ris / in ${item.slug}`)
                    let a = item.slug.split('/');
                    let b = a.shift();
                    let t = this.navRef.value;
                    if(t !== undefined) {
                        console.log(typeof(t))
                        slot = t.querySelector('slot');
                        children = null;
                        if(slot) {
                            children = slot.assignedElements({flatten: true});
                            children.forEach((child) => {
                                let v = child.getAttribute('value');
                                if(v){
                                    console.log(`comparing v ${v} to b ${b}`)
                                    if(v === b) {
                                        return;
                                    }
                                } else {
                                    console.log(`no value retrieved`)
                                }
                            })
                        } else {
                            console.log(`no slot found`)
                        }
                    } else {
                        console.log(`t.value still undefined`)
                    }
                    itemsTemplates.push(html`
                        <sp-sidenav-heading value=${b} label=${b} >
                            ${this.renderItem([],item)}
                        </sp-sidenav-heading>
                    `);

                }
            })

            return itemsTemplates;

        }

    }

    firstUpdated() {
        this.itemsTemplates = [];
        if(this.items_size > 0) {
            let result = this.renderItems();

            if(result !== undefined) {
                console.log(`result of size ${result?.length}`)
                this.itemsTemplates = result;
            }
        }
    }

    protected render() {

        this.itemsTemplates = [];
        if(this.items_size > 0) {
          let result = this.renderItems();

          if(result !== undefined) {
              console.log(`result of size ${result?.length}`)
              this.itemsTemplates = result;
          }
        }

        return html`
            <sp-sidenav variant="multilevel" defaultValue=${this.selection} ${ref(this.navRef)} >
                ${this.itemsTemplates}
            </sp-sidenav>
        `;
    }

}