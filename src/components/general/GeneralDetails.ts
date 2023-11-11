import {  html, css, type PropertyValues} from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import {ref, createRef, type Ref} from 'lit/directives/ref.js';

import { withStores } from "@nanostores/lit";

import {z,  type ZodError} from 'zod';

import { SpectrumElement } from '@spectrum-web-components/base';

import '@spectrum-web-components/dialog/sp-dialog.js';
import '@spectrum-web-components/overlay/sp-overlay.js';
import '@spectrum-web-components/popover/sp-popover.js';
import '@spectrum-web-components/tooltip/sp-tooltip.js';

import {
    type generalInvestment,
    type generalTypeAndUse,
    primaryInvestmentMap,
    secondaryInvestmentMap,
    typeAndUseMap
} from './generalInvestmentStore.ts';

import {
    BuffAdverbs,
    type BuffAdverbsType,
    type BuffAdverbArrayType,
    generalSchema,
    type General,
    generalObjectSchema,
    generalUseCase,
    type generalUseCaseType,
    type generalObject,
    levelSchema,
    type levelSchemaType,
    qualitySchema,
    type qualitySchemaType,
    type standardSkillBookType,
    troopClass,
    type troopClassType, buffSchema, 
} from "@schemas/evonySchemas.ts";

import {tableGeneral} from "@components/general/tableGeneral.ts";
import {
    conflictingGenerals,
    conflictRecords,
} from "@components/general/ConflictingSkillExcludes.ts";


@customElement('general-details')
export class GeneralDetails extends withStores(SpectrumElement, [conflictingGenerals,conflictRecords,typeAndUseMap,primaryInvestmentMap, secondaryInvestmentMap]) {

    @property({type: String})
    public generalId: string;

    @state()
    private general: General | null = null;

    constructor() {
        super();

        this.generalId = '';
    }

    connectedCallback() {
        super.connectedCallback();

    }

    async willUpdate(changedProperties: PropertyValues<this>){
        if (changedProperties.has('generalId')) {
            const generalUrl = new URL(`${this.generalId}.json`, document.URL)
            const result = await fetch (generalUrl).then((response) => {
                if(response.ok) {
                    return response.text();
                } else throw new Error('Status code error: ' + response.status);
            }).then((text) => {
                const jsonResult = JSON.parse(text);
                const result = generalObjectSchema.safeParse(jsonResult)
                if(result.success) {
                    this.general = result.data.general;
                    return true;
                } else {
                    console.error(result.error)
                }
                return false;
            }).catch((error) => {
                console.error(error);
                return false;
            })
        }
    }
    public render() {

        return html`
            
        `
    }

}
