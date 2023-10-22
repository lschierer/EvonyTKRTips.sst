import {
    type ascendingAttributesType,
    type ascendingIncrementType,
    type buff, BuffAttributes,
    type BuffAttributesType,
    BuffAdverbs,
    buffSchema,
    type buffType,
    buffTypeEnum,
    buffValueSchema,
    type General,
    skillBook,
    type skillBookType,
    type specialtyAttributeType,
    type specialtyType
} from '@schemas/evonySchemas.ts';

function multiplier(b: buff, general: General,score_for: BuffAttributesType) {
    let multiplier = 0;

        multiplier = 1;
        if (b.condition !== undefined && b.condition !== null) {
            switch (b.condition){
                case BuffAdverbs.enum.Attacking:
                case BuffAdverbs.enum.Marching:
                case BuffAdverbs.enum.When_Rallying:
                case BuffAdverbs.enum.leading_the_army_to_attack:
                    console.log(`Attacking buff detected`)
                    if(score_for.toString().localeCompare('Attack')) {
                        console.log(`when scoring for attack`)
                        switch (general.score_as) {
                            case 'Ground':
                            case 'Mounted':
                            case 'Archers':
                                console.log(`score_as matched`)
                                multiplier = 0.5;
                                break;
                            case 'Siege':
                                multiplier = 0.25;
                                break;
                            default:
                                multiplier = 0;
                        }
                    } else {
                        multiplier = 0;
                    }
                    break;
                case BuffAdverbs.enum.Reduces_Enemy:
                    multiplier = 1.1; // see my explanation
                    break;
                case BuffAdverbs.enum.Reinforcing:
                case BuffAdverbs.enum.In_City:
                    //due to reduced utility
                    multiplier = 0.75;
                    break;
                case BuffAdverbs.enum.Defending:
                    if(score_for.toString().localeCompare('Attack')) {
                        //due to reduced utility
                        multiplier = 0.75;
                    } else {
                        multiplier = 1;
                        // because for HP and Defense, Defending actually helps.
                    }
                    break;
                case BuffAdverbs.enum.When_The_Main_Defense_General:
                case BuffAdverbs.enum.When_the_City_Mayor:
                case BuffAdverbs.enum.During_SvS:
                case BuffAdverbs.enum.When_an_officer:
                case BuffAdverbs.enum.Against_Monsters:
                case BuffAdverbs.enum.Reduces_Monster:
                    multiplier = 0;
                    break;
                default:
                    console.log(`no adverb matched`)
                    multiplier = 1;
            }
        }
        if (
            (b.class !== undefined && b.class !== null) &&
            (b.condition !== undefined && b.condition !== null)
        ) {
            if(!b.condition.toLocaleString().localeCompare('Reduces Enemy')){
                multiplier = 1.1;
            } else if (b.class.toString().localeCompare(general.score_as!.toLocaleString())){
                multiplier = 0;
            } else {
                console.log(`leaving multiplier alone`);
            }
        } else if(
            (b.condition !== undefined && b.condition !== null) &&
            (!b.condition.toLocaleString().localeCompare('Reduces Enemy'))
        ) {
                multiplier = 1.1;
        }
    return multiplier;
}

export function attack_score(eg: General){
    console.log(`attack_score`)
    let attack = 0;
    let totalBuff = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        attack = (general.attack + (general.attack_increment * 45 ));
        if(general.specialities !== undefined && general.specialities !== null) {
            console.log(`speciality buffs`)
            general.specialities.map((s: specialtyType) => {
                s.attribute.map((sa) => {
                    const buff: buff[] = [sa.buff].flat()
                    buff.map((b) => {
                        if(b !== undefined && b !== null) {
                            const m = multiplier(b, general,BuffAttributes.enum.Attack );
                            if (b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    totalBuff = totalBuff + (b.value.number * m);
                                } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                    attack = attack + b.value.number;
                                }
                            }
                        }
                    })
                })
            })
        }
        if(general.books !== undefined && general.books !== null) {
            console.log(`book buffs`)
            general.books.map((bb) => {
                const buff: buff[] = [bb.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const m = multiplier(b, general, BuffAttributes.enum.Attack);
                        if (b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + (b.value.number * m);
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                attack = attack + b.value.number;
                            }
                        }
                    }

                })
            })
        }
        if(general.ascending !== undefined && general.ascending !== null) {
            console.log(`ascending buffs`);
            general.ascending.map((ga: ascendingIncrementType) => {
                const buff: buff[] = [ga.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const m = multiplier(b, general, BuffAttributes.enum.Attack);
                        if (b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + (b.value.number * m);
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                attack = attack + b.value.number;
                            }
                        }
                    }
                })
            })
        }
    }
    console.log(`total buff is ${totalBuff}`)
    totalBuff = totalBuff / 100; //make it a percent;
    attack = attack + (attack * totalBuff );
    return [totalBuff,attack];
}

export function defense_score(eg: General){
    let defense = 0;
    let totalBuff = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        defense = (general.defense + (general.defense_increment * 45))
        if(general.specialities !== undefined && general.specialities !== null) {
            general.specialities.map((s: specialtyType) => {
                s.attribute.map((sa: specialtyAttributeType) => {
                    const buff: buff[] = [sa.buff].flat()
                    buff.map((b) => {
                        if (b.condition !== undefined && b.condition !== null) {
                            const m = multiplier(b, general, BuffAttributes.enum.Defense);
                            if (b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    totalBuff = totalBuff + (b.value.number * m);
                                } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                    defense = defense + b.value.number;
                                }
                            }
                        }
                    })

                })
            })
        }
        if(general.books !== undefined && general.books !== null) {
            console.log(`book buffs`)
            general.books.map((bb) => {
                const buff: buff[] = [bb.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const m = multiplier(b, general, BuffAttributes.enum.Defense);
                        if (b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + (b.value.number * m);
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                defense = defense + b.value.number;
                            }
                        }
                    }

                })
            })
        }
        if(general.ascending !== undefined && general.ascending !== null) {
            console.log(`ascending buffs`);
            general.ascending.map((ga: ascendingIncrementType) => {
                const buff: buff[] = [ga.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const m = multiplier(b, general, BuffAttributes.enum.Defense);
                        if (b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + (b.value.number * m);
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                defense = defense + b.value.number;
                            }
                        }
                    }
                })
            })
        }
    }
    console.log(`total buff is ${totalBuff}`)
    totalBuff = totalBuff / 100; //make it a percent;
    defense = defense + (defense * totalBuff );
    return [totalBuff,defense];
}
export function hp_score(eg: General){
    let hp = 0;
    let totalBuff = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        hp = (general.leadership + (general.leadership_increment * 45))
        if(general.specialities !== undefined && general.specialities !== null) {
            general.specialities.map((s) => {
                s.attribute.map((sa) => {
                    const buff = [sa.buff].flat()
                    buff.map((b) => {
                        if (b.condition !== undefined && b.condition !== null) {
                            const m = multiplier(b, general, BuffAttributes.enum.Attack);
                            if (b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    totalBuff = totalBuff + (b.value.number * m);
                                } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                    hp = hp + b.value.number;
                                }
                            }
                        }
                    })

                })
            })
        }
        if(general.books !== undefined && general.books !== null) {
            console.log(`book buffs`)
            general.books.map((bb) => {
                const buff: buff[] = [bb.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const m = multiplier(b, general, BuffAttributes.enum.HP);
                        if (b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + (b.value.number * m);
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                hp = hp + b.value.number;
                            }
                        }
                    }

                })
            })
        }
        if(general.ascending !== undefined && general.ascending !== null) {
            console.log(`ascending buffs`);
            general.ascending.map((ga: ascendingIncrementType) => {
                const buff: buff[] = [ga.buff].flat();
                buff.map((b) => {
                    if(b !== undefined && b !== null) {
                        const m = multiplier(b, general, BuffAttributes.enum.HP);
                        if (b.value !== undefined && b.value !== null) {
                            const buff_type = b.value.unit;
                            if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                totalBuff = totalBuff + (b.value.number * m);
                            } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                hp = hp + b.value.number;
                            }
                        }
                    }
                })
            })
        }
    }
    console.log(`total buff is ${totalBuff}`)
    totalBuff = totalBuff / 100; //make it a percent;
    hp = hp + (hp * totalBuff );
    return [totalBuff,hp];
}