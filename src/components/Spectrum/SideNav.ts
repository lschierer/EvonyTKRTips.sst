import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {ref,createRef} from 'lit/directives/ref.js';
import type {TemplateResult} from "@spectrum-web-components/base";

import * as d3select from 'd3-selection';

export type entry = {
    slug: string,
    title: string,
    base: string,
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
        console.log(`ccb 1st type of items is ${typeof(this.items)}`)
        if(typeof(this.items) === 'string') {
            console.log(`items is a string ${this.items}`)
            this.items = JSON.parse(this.items)
        }

        console.log(`ccb 2nd type of items is ${typeof(this.items)}`)

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
            console.log(`ri / in i is ${item.slug} s is ${s}`)
            let a2 = s.split('/');
            let b2 = a2.shift();

            if(!children){
                console.log(`made it to not children with base ${b2}`)
                let new_i = {
                    slug: a2.join('/'),
                    title: item.title,
                    base: item.base
                }
                let d = dirstack.concat([b,b2]);
                console.log(`about to recurse d is ${d} new_i is ${new_i.slug}`)
                return html`
                    <sp-sidenav-item value=${b2} label=${b2} >
                        ${this.renderItem(d,new_i)}
                    </sp-sidenav-item>
                `
            } else {
                console.log(`there are children`)
            }
        } else {
            console.log(`ri there was no / item is ${item.slug}`)
            console.log(`dirstack is ${dirstack}`)
            let u = item.base + dirstack.flat().join('/') + '/' + item.slug;
            console.log(`u is ${u} t is ${item.title}`)
            return html`
                <sp-sidenav-item value=${b} href=${u} > ${item.title}</sp-sidenav-item>
                `
        }
    }
    protected renderItems(table: Element | undefined) {
        let itemsTemplates: TemplateResult[] = [];
        let children = this.querySelector('sp-sidenav-item');
        if(table === undefined){
            console.log(`in ri, table is undefined`)
            return
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
                    let slot = this.shadowRoot.querySelector('slot');
                    children = slot ? slot.assignedElements({flatten: true}) : null;
                    if(children) {
                        console.log(`ri in / children found`)
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
                            console.log(`no children found`)
                        }

                    itemsTemplates.push(html`
                        <sp-sidenav-item value=${b} label=${b} >
                            ${this.renderItem([],item)}
                        </sp-sidenav-item>
                    `);
                    this.itemsTemplates = itemsTemplates;
                    this.requestUpdate();
                }
            })
            this.itemsTemplates = itemsTemplates;
            this.requestUpdate();
        }

    }

    firstUpdated() {
        const _table = this.navRef.value!;
        /*this.itemsTemplates = [];
        if(this.items_size > 0) {
            let result = this.renderItems();

            if(result !== undefined) {
                console.log(`result of size ${result?.length}`)
                this.itemsTemplates = result;
            }
        }*/
    }

    protected render() {

        return html`
            <sp-sidenav variant="multilevel" defaultValue=${this.selection} ${ref(this.renderItems)} >
                ${this.itemsTemplates}
            </sp-sidenav>
        `;
    }

}