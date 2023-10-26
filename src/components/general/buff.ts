import {
    type ascendingAttributesType,
    type ascendingIncrementType,
    type buff,
    BuffAttributes,
    type BuffAdverbsType,
    type BuffAdverbArrayType,
    type BuffAttributesType,
    buffSchema,
    type buffType,
    buffTypeEnum,
    buffValueSchema,
    type General,
    type levelSchemaType,
    skillBook,
    type skillBookType,
    type specialtyAttributeType,
    type specialtyType,
    type troopClassType,
    type qualitySchemaType, BuffAdverbs
} from '@schemas/evonySchemas.ts';

interface Props {
    ascending: levelSchemaType,
    Speciality1: qualitySchemaType,
    Speciality2: qualitySchemaType,
    Speciality3: qualitySchemaType,
    Speciality4: qualitySchemaType,
}
function buffFilter(b: buff, general: General, score_for: BuffAttributesType, situations?: BuffAdverbArrayType) {
    const name = general.name;
    console.log(`bufFilter; start ---- ${name} ----`)
    let toReturn = false;

    if (b.condition !== undefined && b.condition !== null) {
        console.log(`buffFilter; ${name} condition ${b.condition}`)
        const condition: BuffAdverbsType[] = [b.condition].flat();

        //special case conditions
        if(condition.includes(BuffAdverbs.enum.Reduces_Monster)) {
            if(situations !== null && situations !== undefined && situations.includes(BuffAdverbs.enum.Reduces_Monster)) {
                if(b.attribute === BuffAttributes.enum.Attack && score_for === BuffAttributes.enum.Defense) {
                    return true;
                }
                if((b.attribute === BuffAttributes.enum.Defense || b.attribute === BuffAttributes.enum.HP) &&
                    score_for === BuffAttributes.enum.Attack) {
                    return true;
                }
            }
            return false;
        }
        if(condition.includes(BuffAdverbs.enum.Reduces_Enemy)) {
            if(situations !== null && situations !== undefined && (! (situations.includes(BuffAdverbs.enum.Reduces_Monster) || situations.includes(BuffAdverbs.enum.When_an_officer)))) {
                if(b.attribute === BuffAttributes.enum.Attack && score_for === BuffAttributes.enum.Defense) {
                    return true
                }
                if((b.attribute === BuffAttributes.enum.Defense || b.attribute === BuffAttributes.enum.HP) &&
                    score_for === BuffAttributes.enum.Attack) {
                    return true;
                }
            }
            return false;
        }

        if (situations !== null && situations !== undefined && condition !== null && condition !== undefined) {
            const intersection = situations.filter(x => condition.includes(x));
            if (condition.length > intersection.length) {
                console.log(`buffFilter; ${name} condition intersection is ${intersection.length} condition is ${condition.length}`)
                return false;
            } else {
                console.log(`buffFilter; ${name} condition within intersection`);
                toReturn = true;
            }
        } else {
            console.log(`buffFilter; ${name} condition or situation not defined`);
            toReturn = true;
        }
        console.log(`buffFilter; ${name} after 1st if, return value ${toReturn}`)
    } else {
        console.log(`buffFilter; ${name} skipp 1st if`)
    }

    if(general.score_as !== undefined && general.score_as !== null ) {
        const score_as = general.score_as;
        if (b.class !== undefined && b.class !== null){
            console.log(`buffFilter; ${name} class ${b.class} score_as ${JSON.stringify(score_as)}`)
            const result =  (!b.class.localeCompare(score_as));
            if(!result) {
                return false;
            }
            toReturn = result;
        }
    }
    console.log(`buffFilter; ${name} after 2nd if, return value ${toReturn}`)

    if(b.attribute !== undefined && b.attribute !== null) {
        console.log(`buffFilter; ${name} attribute ${b.attribute} against ${score_for}`)
        toReturn = (!score_for.localeCompare(b.attribute));
    }
    console.log(`buffFilter; ${name} after 3rd if, return value ${toReturn}`)

    return toReturn;
}

const ascendingLevel: { [key: string]: boolean} = {
    '0': false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': true,
    '7': true,
    '8': true,
    '9': true,
    '10': true,
}

export function buff(eg: General, situations: BuffAdverbArrayType, props: Props){
    const saLevels = [props.Speciality1, props.Speciality2, props.Speciality3, props.Speciality4]
    console.log(`buff; general is ${eg.name}`)
    let attack = 0;
    let hp = 0;
    let defense = 0;
    let rally = 0;
    let march = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        if(general.books !== undefined && general.books !== null) {
            console.log(`buff; ${eg.name}; book buffs`)
            general.books.map((bb) => {
                const buff: buff[] = [bb.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null && general !== undefined) {
                        let apply = buffFilter(b, general,BuffAttributes.enum.Attack,situations );
                        if (apply && b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if((b.condition !== null && b.condition !== undefined) &&
                                (
                                    ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                    ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                )
                            ) {
                                console.log(`buff; ${eg.name}; books; attack: debuff adjustment`);
                                attack = attack + Math.abs(b.value.number);
                                console.log(`buff; ${eg.name}; books; attack: ${attack}`)
                            }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                attack = attack + b.value.number
                                console.log(`buff; ${eg.name}; books; attack: ${attack}`)
                            }
                        }
                        apply = buffFilter(b,general, BuffAttributes.enum.Defense,situations);
                        console.log(`buff; ${eg.name}; book defense; apply is ${apply}`);
                        if (apply && b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if((b.condition !== null && b.condition !== undefined) &&
                                (
                                    ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                    ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                )
                            ) {
                                console.log(`buff; ${eg.name}; books; defense: debuff adjustment`);
                                defense = defense + Math.abs(b.value.number);
                                console.log(`buff; ${eg.name}; books; defense: ${defense}`)
                            }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                defense = defense + b.value.number
                                console.log(`buff; ${eg.name}; books; defense: ${defense}`)
                            }
                        }
                        apply = buffFilter(b,general, BuffAttributes.enum.HP,situations);
                        if (apply && b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                hp = hp + b.value.number
                                console.log(`buff; ${eg.name}; books; hp: ${hp}`)
                            }
                        }
                    }
                    
                })
            })
        }

        if(general.specialities !== undefined && general.specialities !== null) {
            console.log(`buff; ${eg.name}; speciality buffs;`)
            general.specialities.forEach((s: specialtyType, i) => {
                s.attribute.map((sa) => {
                    let proceed = false;
                    console.log(`buff; ${eg.name}; speciality buffs; saLevel: ${saLevels[i]}`)
                    switch(saLevels[i]){
                        case 'Gold':
                            if(!sa.level.localeCompare('Gold')) {
                                proceed = true;
                                break;
                            }
                        case 'Orange':
                            if(!sa.level.localeCompare('Orange')) {
                                proceed = true;
                                break;
                            }
                        case 'Purple':
                            if(!sa.level.localeCompare('Purple')) {
                                proceed = true;
                                break;
                            }
                        case 'Blue':
                            if(!sa.level.localeCompare('Blue')) {
                                proceed = true;
                                break;
                            }
                        case 'Green':
                            if(!sa.level.localeCompare('Green')) {
                                proceed = true;
                                break;
                            }
                        default:
                            proceed = false;
                    }
                    if(proceed) {
                        console.log(`buff; ${eg.name}; speciality buffs; i is ${i} proceed on ${sa.level}`)
                        const buff: buff[] = [sa.buff].flat()
                        buff.map((b) => {
                            if(b !== undefined && b !== null && general !== undefined) {
                                let apply = buffFilter(b, general,BuffAttributes.enum.Attack,situations);
                                console.log(`buff; ${eg.name}; speciality attack; apply is ${apply}`);
                                if (apply && b.value !== undefined && b.value !== null) {
                                    const buff_type = b.value.unit;
                                    if((b.condition !== null && b.condition !== undefined) &&
                                        (
                                            ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                            ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                        )
                                    ) {
                                        console.log(`buff; ${eg.name}; books; attack: debuff adjustment`);
                                        attack = attack + Math.abs(b.value.number);
                                        console.log(`buff; ${eg.name}; books; attack: ${attack}`)
                                    }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                        attack = attack + b.value.number
                                        console.log(`buff; ${eg.name}; specialities; attack: ${attack}`)
                                    }
                                }
                                apply = buffFilter(b,general, BuffAttributes.enum.Defense,situations);
                                console.log(`buff; ${eg.name}; speciality defense; apply is ${apply}`);
                                if (apply && b.value !== undefined && b.value !== null) {
                                    const buff_type = b.value.unit;
                                    if((b.condition !== null && b.condition !== undefined) &&
                                        (
                                            ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                            ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                        )
                                    ) {
                                        console.log(`buff; ${eg.name}; books; defense: debuff adjustment`);
                                        defense = defense + Math.abs(b.value.number);
                                        console.log(`buff; ${eg.name}; books; defense: ${defense}`)
                                    }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                        defense = defense + b.value.number
                                        console.log(`buff; ${eg.name}; specialities; Defense: ${defense}`)
                                    }
                                }
                                apply = buffFilter(b,general, BuffAttributes.enum.HP,situations);
                                if (apply && b.value !== undefined && b.value !== null) {
                                    const buff_type = b.value.unit;
                                    if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                        hp = hp + b.value.number
                                        console.log(`buff; ${eg.name}; specialities; hp: ${hp}`)
                                    }
                                }
                            } else {
                                console.log(`buff; ${eg.name}; speciality buffs; buff is undefined`)
                            }
                        })
                    } else {
                        console.log(`buff; ${eg.name}; speciality buffs; i is ${i} ${saLevels[i]} did not match ${sa.level}`)
                    }

                })
            })
        }

        if(general.ascending !== undefined && general.ascending !== null && ascendingLevel[props.ascending]) {
            console.log(`buff; ${eg.name}; start ascending buffs`);
            general.ascending.map((ga: ascendingIncrementType) => {
                let proceed = false;
                switch(props.ascending) {
                    case '10':
                        if(!ga.level.localeCompare('10')) {
                            proceed = true;
                            break;
                        }
                    case '9':
                        if(!ga.level.localeCompare('9')) {
                            proceed = true;
                            break;
                        }
                    case '8':
                        if(!ga.level.localeCompare('8')) {
                            proceed = true;
                            break;
                        }
                    case '7':
                        if(!ga.level.localeCompare('7')) {
                            proceed = true;
                            break;
                        }
                    case '6':
                        if(!ga.level.localeCompare('6')) {
                            proceed = true;
                            break;
                        }
                    default:
                        proceed = false;
                }
                if(proceed) {
                    const buff: buff[] = [ga.buff].flat();
                    buff.map((b) => {
                        if(b !== undefined && b !== null && general) {
                            let apply = buffFilter(b, general,BuffAttributes.enum.Attack,situations);
                            if (apply && b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if((b.condition !== null && b.condition !== undefined) &&
                                    (
                                        ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                        ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                    )
                                ) {
                                    console.log(`buff; ${eg.name}; books; attack: debuff adjustment`);
                                    attack = attack + Math.abs(b.value.number);
                                    console.log(`buff; ${eg.name}; books; attack: ${attack}`)
                                }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    attack = attack + b.value.number
                                    console.log(`buff; ${eg.name}; ascending; attack: ${attack}`)
                                }
                            }
                            apply = buffFilter(b,general, BuffAttributes.enum.Defense,situations);
                            if (apply && b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if((b.condition !== null && b.condition !== undefined) &&
                                    (
                                        ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Monster)) ||
                                        ([b.condition].flat().includes(BuffAdverbs.enum.Reduces_Enemy))
                                    )
                                ) {
                                    console.log(`buff; ${eg.name}; books; defense: debuff adjustment`);
                                    defense = defense + Math.abs(b.value.number);
                                    console.log(`buff; ${eg.name}; books; defense: ${defense}`)
                                }else if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    defense = defense + b.value.number
                                    console.log(`buff; ${eg.name}; ascending; defense: ${defense}`)
                                }
                            }
                            apply = buffFilter(b,general, BuffAttributes.enum.HP,situations);
                            console.log(`buff; ${eg.name}; ascending defense; apply is ${apply}`);
                            if (apply && b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    hp = hp + b.value.number
                                    console.log(`buff; ${eg.name}; ascending; hp: ${hp}`)
                                }
                            }
                        }
                    })
                } else {
                    console.log(`buff; ${eg.name}; did not evaluate ascending buff`)
                }
            })
        } else {
            console.log(`buff; ${eg.name}; props.ascending was ${props.ascending}`)
        }
    }


    console.log(`buff; ${eg.name}; total attack buff is ${attack}`);
    console.log(`buff; ${eg.name}; total defense buff is ${defense}`)
    
    return {attackBuff: attack, defenseBuff: defense, hpBuff: hp};
}

