import '@spectrum-web-components/table/elements.js';
import { Table } from '@spectrum-web-components/table';
export interface Mayor {
    name: string | undefined;
    free: string | undefined;
    mrank: string | undefined;
    mgrade: string | undefined;
    mps: string | undefined;
    mns: string | undefined;
    yrank: string | undefined;
    ygrade: string | undefined;
    yps: string | undefined;
    yns: string | undefined;
    orank: string | undefined;
    ograde: string | undefined;
    ops: string | undefined;
    ons: string | undefined;
    prank: string | undefined;
    pgrade: string | undefined;
    pps: string | undefined;
    pns: string | undefined;
}
export declare class MayorTable extends Table {
    CsvUrl: string;
    protected _headings: string[];
    protected _ids: string[];
    private _items?;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected getMayors(): void;
    render(): import("lit").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "mayor-table": MayorTable;
    }
}
