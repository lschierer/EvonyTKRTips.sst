import { LitElement, PropertyValues } from 'lit';
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export declare class MarkDown extends LitElement {
    private raw;
    path: string;
    private myPath;
    private _parsed;
    constructor();
    willUpdate(changedProperties: PropertyValues<this>): Promise<void>;
    private parseMarkdown;
    private fetchFile;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mark-down': MarkDown;
    }
}
