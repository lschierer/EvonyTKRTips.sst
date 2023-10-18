import {
    buffSchema,
    type buffType, buffTypeEnum,
    buffValueSchema,
    type General
} from '@schemas/evonySchemas.ts';

export function attack_score(eg: General){
    console.log(`attack_score`)
    let attack = 0;
    let totalBuff = 0;
    if(eg.score_as !== null && eg.score_as !== undefined) {
        //const general = eg.general;
        const general = eg;
        attack = (general.attack + (general.attack_increment * 45 ));
        if(general.specialities !== undefined && general.specialities !== null) {
            general.specialities.map((s) => {
                s.attribute.map((sa) => {
                    const buff = [sa.buff].flat()
                    buff.map((b) => {
                        if (b.attribute === 'Attack') {
                            let multiplier = 1;
                            if (b.condition !== undefined && b.condition !== null) {
                                switch (b.condition){
                                    case 'Attacking':
                                    case 'Marching':
                                    case 'When Rallying':
                                    case 'leading the army to attack':
                                        console.log(`Attacking buff detected`)
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
                                        break;
                                    case 'Reduces Enemy':
                                        multiplier = 1; // see my explanation
                                        break;
                                    case 'Reinforcing':
                                    case 'In City':
                                    case 'Defending':
                                        multiplier = 0.75; //due to reduced utility
                                        break;
                                    case 'When The Main Defense General':
                                    case 'When the City Mayor':
                                    case 'During SvS':
                                    case 'When an officer':
                                    case 'Against Monsters':
                                    case 'Reduces Monster':
                                        multiplier = 0;
                                        break;
                                    default:
                                        console.log(`no adverb matched`)
                                        multiplier = 1;
                                }
                            }
                            if (b.class !== undefined && b.class !== null) {
                                if (b.class !== 'Ground') {
                                    console.log(`class was ${b.class}`)
                                    multiplier = 0;
                                } else {
                                    console.log(`leaving multiplier unchanged with ${multiplier}`)
                                }
                            }
                            if (b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                   totalBuff = totalBuff + (b.value.number * multiplier);
                                } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                    attack = attack + b.value.number;
                                }
                            }
                        }
                    })
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
            general.specialities.map((s) => {
                s.attribute.map((sa) => {
                    const buff = [sa.buff].flat()
                    buff.map((b) => {
                        if (b.attribute === 'Defense') {
                            let multiplier = 1;
                            if (b.condition !== undefined && b.condition !== null) {
                                switch (b.condition){
                                    case 'Attacking':
                                    case 'Marching':
                                    case 'When Rallying':
                                    case 'leading the army to attack':
                                    case 'When The Main Defense General':
                                    case 'When the City Mayor':
                                    case 'During SvS':
                                    case 'When an officer':
                                    case 'Against Monsters':
                                    case 'Reduces Monster':
                                        multiplier = 0;
                                        break;
                                    case 'Reinforcing':
                                    case 'In City':
                                    case 'Defending':
                                        multiplier = 1; //not debuffed here because I am looking for defense
                                    case 'Reduces Enemy':
                                        multiplier = 1.5; // see my explanation
                                        break;
                                    default:
                                        console.log(`no adverb matched`)
                                        
                                    
                                }
                            }
                            if (b.class !== undefined && b.class !== null) {
                                if (b.class !== 'Ground') {
                                    multiplier = 0;
                                }
                            }
                            if (b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    totalBuff = totalBuff +  (b.value.number * multiplier);
                                } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                    defense = defense + b.value.number;
                                }
                            }
                        }
                    })
                })
            })
        }
    }
    totalBuff = totalBuff / 100; //make it a percent;
    defense = defense + (defense * totalBuff);
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
                        if (b.attribute === 'HP') {
                            let multiplier = 1;
                            if (b.condition !== undefined && b.condition !== null) {
                                console.log(`setting multiplier by condition`)
                                switch (b.condition){
                                    case 'Attacking':
                                    case 'Marching':
                                    case 'When Rallying':
                                    case 'leading the army to attack':
                                    case 'When The Main Defense General':
                                    case 'When the City Mayor':
                                    case 'During SvS':
                                    case 'When an officer':
                                    case 'Against Monsters':
                                    case 'Reduces Monster':
                                        multiplier = 0;
                                        break;
                                    case 'Reduces Enemy':
                                        multiplier = 1.5; // see my explanation
                                        break;
                                    case 'Reinforcing':
                                    case 'In City':
                                        multiplier = 0.75; // due to reduced utility, partially debuffed
                                        break;
                                    case 'Defending':
                                    default:
                                        multiplier = 1;
                                }
                            }
                            if (b.class !== undefined && b.class !== null) {
                                if (b.class !== 'Ground') {
                                    multiplier = 0;
                                }
                            }
                            if (b.value !== undefined && b.value !== null) {
                                const buff_type = b.value.unit;
                                if (!buff_type.localeCompare(buffTypeEnum.enum.percentage)) {
                                    totalBuff = totalBuff + (b.value.number * multiplier);
                                } else if (!buff_type.localeCompare(buffTypeEnum.enum.flat)) {
                                    hp = hp + b.value.number;
                                }
                            }
                        }
                    })
                })
            })
        }
    }
    totalBuff = totalBuff / 100; //make it a percent;
    hp = hp + (hp * totalBuff);
    return [totalBuff,hp];
}
