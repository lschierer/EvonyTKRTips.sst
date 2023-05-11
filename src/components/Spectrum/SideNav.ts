import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {ref,createRef} from 'lit/directives/ref.js';
import type {TemplateResult} from "@spectrum-web-components/base";
import '@spectrum-web-components/icon/sp-icon.js';
import '@spectrum-web-components/icons/sp-icons-medium.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-folder.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-folder-open.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-document-outline.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-file-txt.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-breadcrumb-navigation.js';

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

    private _entries: Set<string>;

    private _directories: string[];

    @state()
    private items_size: number;

    @state()
    private selection: string;

    @state()
    private itemsTemplates: TemplateResult[];

    navRef:Ref<HTMLInputElement> = createRef();

    private myUrl: URL;

    static styles = css`
        #SideMenu  sp-sidenav {
          flex: 1 1 auto;
          min-height: 1px;
          height: 90vh;
          min-width: 1px;
          width: 100%;
          background-color: var(--spectrum-gray-200)
        };
        :focus-visible {
          background-color: var(--spectrum-gray-300)
        } ;
    `;

    constructor(props) {
        super(props);
        this.myUrl = new URL(document.documentURI);
        this.itemsTemplates = [];
        this._entries = new Set();
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

    protected renderDir(dirstack: string, level: number) {

        console.log(`going to render ${dirstack} with level ${level}`)

        console.log(`I am ${this.myUrl}`);

        this._entries.add(dirstack);
        let itemTemplates = [];
        let temp_items = [].concat(this.items)
        for (let item of temp_items) {
            console.log(`eval of ${item.slug} looking for ${dirstack}`)
            if (dirstack === item.slug) {
                continue;
            }
            let s = item.slug;
            let d = dirstack.split('/')

            if (s.at(0) === '/') {
                s = s.substring(1);
            }
            let valid = false

            let a = s.split('/');
            for (let i = 0; i <= level; i++) {
                if(d[i] === a[i]) {
                    /*console.log(`compared ${d[i]} to ${a[i]} looking for ${dirstack}`)*/
                    valid = true;
                } else {
                    valid = false;
                    break;
                }
            }
            if(valid) {
                console.log(`${item.slug} is a valid match for ${dirstack}`);
                let b = '';
                a = s.split('/')
                let l = level;
                do{
                    b = a.shift();
                    l--;
                }while(l >= 0);

                if (a.length > 1) {
                    b = a.shift();
                    if(!this._entries.has(dirstack + '/' + b)) {
                        itemTemplates.push( html`
                            <sp-sidenav-item manage-tab-index value=${b} label=${b}>
                                <sp-icon-folder slot="icon"></sp-icon-folder>
                                ${this.renderDir(dirstack + '/' + b, level+1)}
                            </sp-sidenav-item>
                        `);
                    }

                } else {
                    let u = item.base;
                    console.log(`u starts as ${u}`)
                    if(!u.endsWith('/')){
                        u = u + '/';

                    }
                    console.log(`about to add dirstack ${dirstack} and slug ${item.slug} to u ${u}`);
                    u = u + item.slug;
                    console.log(`u is now ${u}`)
                    if(u.toLocaleString().toLocaleLowerCase().localeCompare(this.myUrl.toString().toLocaleLowerCase()) === 0) {
                        this.selection = item;
                        itemTemplates.push( html`
                            <sp-sidenav-item value=${a} href=${u} selected >
                                <sp-icon-breadcrumb-navigation slot="icon"></sp-icon-breadcrumb-navigation>
                                ${item.title}
                            </sp-sidenav-item>
                        `);
                    } else {
                        itemTemplates.push( html`
                            <sp-sidenav-item value=${a} href=${u}>
                                <sp-icon-file-txt slot="icon"></sp-icon-file-txt>
                                ${item.title}
                            </sp-sidenav-item>
                        `);
                    }

                    let index = temp_items.indexOf(item);
                    temp_items.splice(index,1);
                }

            }
        }
        return itemTemplates;
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
            }
            this.items.forEach((item) => {
                if(item.slug.at(0) === '/') {
                    item.slug = item.slug.substring(1);
                }
                if(item.slug.includes('/')){
                    let a = item.slug.split('/');
                    let b = a.shift();

                    if(!this._entries.has(b)) {
                        itemsTemplates.push(html`
                        <sp-sidenav-item manage-tab-index value=${b} label=${b} ${ref(this.expander)} expanded>
                            <sp-icon-folder-open slot="icon"></sp-icon-folder-open>
                            ${this.renderDir(b, 0)}
                        </sp-sidenav-item>
                    `);
                    }

                    this.itemsTemplates = itemsTemplates;
                    this.requestUpdate();
                }
            })
            this.itemsTemplates = itemsTemplates;
            this.requestUpdate();
        }

    }

    expander(item?: Element) {
        if(item) {
            let expanded = item.hasAttribute('expanded');
            if(expanded){
                console.log(`${item.value} is expanded`)
            }
        }

    }

    firstUpdated() {
        const _table = this.navRef.value!;

    }

    protected render() {

        return html`
            
            <div id="SideMenu">
                <sp-sidenav variant="multilevel" manage-tab-index="true" defaultValue=${this.selection} id="SideMenu" ${ref(this.renderItems)} >
                    ${this.itemsTemplates}
                </sp-sidenav>    
            </div>
            
        `;
    }

}