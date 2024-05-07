
import {
    ConflictArray,
    type ConflictArrayType,
    ConflictDatum,
    type ConflictDatumType,
    GeneralClass,
    type GeneralClassType,
    GeneralElement,
    type GeneralElementType,
  } from "@schemas/index";

export class generalPair {

    readonly primary: GeneralClassType;

    readonly secondary: GeneralClassType | null;

    constructor(p: GeneralClassType, allGenerals: GeneralElementType[], index = 1) {
        this.primary = p;

        let currentIndex = 0;
        let found: GeneralClassType | null = null;
        for(const gE of allGenerals){
            if(currentIndex < index) {
                if(gE.general.name.localeCompare(p.name, undefined, {sensitivity: 'base'})) {
                    if(gE.general.score_as === p.score_as) {
                        found = gE.general;
                        currentIndex++;
                    }
                }
            } else {
                break;
            }
        }
        this.secondary = found;
    }
}