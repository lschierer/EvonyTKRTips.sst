import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';


@customElement('sp-nm')
export class SpNavMenu extends LitElement {

    @property()
    public items: string[];

    private _entries: Set<{value:string, level:number}>;

    private _directories: string[];

    @state()
    private items_size: number;

    @state()
    private selection: string;

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

        this.items =  [];
        this.items_size = 0;
        this._entries = new Set();
        this.selection = '';
    }


    connectedCallback() {
        super.connectedCallback();
        this.items = this.items.split(',');
        this.items_size = this.items.length;

        this.items.forEach((item) => {

            let i = 0;
            let t = item;

            while (t.includes('/')) {
                let a = t.split('/');
                console.log(`processing ${t} of ${item}, length is ${a.length}`);
                const d:string = a.shift();
                this._entries.add({value: d,level: i });
                if(a.length >= 2){
                    t = a.join('/');
                } else {
                    t = a.pop();
                }
                console.log(`d is ${d}, t is ${t}`)
                i++;
            }
            this._entries.add({value: item,level: i});
        });

        this.requestUpdate();
    }



    protected render(): unknown {


        return html`
            <sp-sidenav variant="multilevel" defaultValue=${this.selection}  >
                
                    
            </sp-sidenav>
        `;
    }

}