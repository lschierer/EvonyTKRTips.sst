import {
  generalSchema,
  type General,
  generalObjectSchema,
  type generalObject,
  troopClass,
  type troopClassType, generalConflictArraySchema, type generalConflictArray,
} from '@schemas/evonySchemas.ts';

import {atom, map, action, computed} from "nanostores";
import { logger } from '@nanostores/logger'

import {z} from "zod";

type GeneralDictionary = {
  [key: string]: Array<string>;
}

const letters = new Set(["a","b","c"]);

const generalConflictCollection = z.array(generalConflictArraySchema);
export const conflictRecords = atom<Record<string,string[]>[]>();

export const conflictingGenerals = computed(conflictRecords, CRs => {
  if(CRs !== undefined && CRs !== null) {
    const valid = generalConflictCollection.safeParse(CRs)
    if (valid.success) {
      let Returnable = new Map<string,Array<string>>();
      for (let i = 0; i < valid.data.length; i++) {
        let o1 = valid.data[i]
        let valid2 = generalConflictArraySchema.safeParse(o1);
        if (valid2.success) {
          const data: Record<string, string>[] = [valid2.data.conflicts].flat();
          for (let j = 0; j < data.length; j++) {
            const o2 = data[j];
            const keys = Object.keys(o2);
            for (let k = 0; k < keys.length; k++) {
              if (keys[k].localeCompare('other')) {
                for (let l = 0; l < o2[keys[k]].length; l++) {
                  const o3: string[] = o2[keys[k]];
                  let n1: string = o3[l];
                  let confl = new Set<string>();
                  for (let m = 0; m < keys.length; m++) {
                    for(let n = 0; n < o2[keys[m]].length; n++) {
                      const o4: string = o2[keys[m]][n];
                      if(n1.localeCompare(o4)) {
                        confl.add(o4);
                      }
                    }
                    let n2: string = o3[m]
                    if(n1.localeCompare(n2)) {
                      confl.add(n2);
                    }
                  }
                  const stringArray: string[] = [...confl];
                  Returnable.set(n1, stringArray);
                }
              }
            }
          }
        } else {
          console.error(`invalid assumption about zod data type`)
        }
      }
      return Returnable;
    }
  }
});

let destroy = logger({
  'ConflictRecords': conflictRecords,
  'ConflictingGenerals': conflictingGenerals,
})

export const initialLoad = action(conflictingGenerals, 'initial Load', (store) => {
  mountLoad();
})

export function checkConflicts (name1: string, name2: string, generalClass?: troopClassType) {
  if(name1 === name2 || !name1.localeCompare(name2, undefined, {sensitivity: 'base'})) {
    return true;
  }
  let records = conflictingGenerals.get()
  if(records !== null && records !== undefined) {
    const personal = records.get(name1)
    if(personal !== null && personal !== undefined){
        const searchable =Object.values(personal).flat(Infinity)
        return searchable.includes(name2);
    } else {
    }
  }
  console.error(`no records returned at all;`)
  return false;
}

const mountLoad = action(conflictingGenerals, 'mount load', (store) => {

});

const mt1Load = action(conflictingGenerals, 'mt1 load', (store) => {
  const _set = new Set();
  
  mt1.forEach((n) => {
    _set.add(n);
  })
  
  mt1a.forEach((n) => {
    _set.add(n)
  })
  
  mt1b.forEach((n) => {
    _set.add(n)
  })
  
  mt1c.forEach((n) => {
    _set.add(n)
  })
  
  mt2b.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
  
});

const mt1aLoad = action(conflictingGenerals, 'mt1a load', (store) => {
  const _set = new Set();
  
  mt1a.forEach((n) => {
    _set.add(n)
  })
  
  mt1.forEach((n) => {
    _set.add(n)
  })
  
  mt1b.forEach((n) => {
    _set.add(n)
  })
  
  mt1c.forEach((n) => {
    _set.add(n)
  })
  
  mt2b.forEach((n) => {
    _set.add(n)
  })
  
  ms1.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
});

const mt1bLoad = action(conflictingGenerals, 'mt1b load', (store) => {
  const _set = new Set();
  
  mt1b.forEach((n) => {
    _set.add(n)
  })
  
  mt1.forEach((n) => {
    _set.add(n)
  })
  
  mt1a.forEach((n) => {
    _set.add(n)
  })
  
  mt1c.forEach((n) => {
    _set.add(n)
  })
  
  mt2b.forEach((n) => {
    _set.add(n)
  })
  
  mt2c.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
});

const mt1cLoad = action(conflictingGenerals, 'mt1b load', (store) => {
  const _set = new Set();
  
  mt1b.forEach((n) => {
    _set.add(n)
  })
  
  mt1.forEach((n) => {
    _set.add(n)
  })
  
  mt1a.forEach((n) => {
    _set.add(n)
  })
  
  mt1c.forEach((n) => {
    _set.add(n)
  })
  
  mt2b.forEach((n) => {
    _set.add(n)
  })
  
  mt2d.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
});


const mt2Load = action(conflictingGenerals, 'mt2 load', (store) => {
  const _set = new Set();
  
  mt2.forEach((n) => {
    _set.add(n)
  })
  
  mt2a.forEach((n) => {
    _set.add(n)
  })
  
  mt2b.forEach((n) => {
    _set.add(n)
  })
  
  mt2c.forEach((n) => {
    _set.add(n)
  })
  
  mt2d.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt2aLoad = action(conflictingGenerals, 'mt2a load', (store) => {
  const _set = new Set();
  
  mt2a.forEach((n) => {
    _set.add(n)
  })
  
  mt2.forEach((n) => {
    _set.add(n)
  })
  
  mt2b.forEach((n) => {
    _set.add(n)
  })
  
  mt2c.forEach((n) => {
    _set.add(n)
  })
  
  mt2d.forEach((n) => {
    _set.add(n)
  })
  
  at1.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt2bLoad = action(conflictingGenerals, 'mt2b load', (store) => {
  const _set = new Set();

  mt2b.forEach((n) => {
    _set.add(n)
  })
  
  mt1.forEach((n) => {
    _set.add(n)
  })
  
  mt1a.forEach((n) => {
    _set.add(n)
  })
  
  mt1b.forEach((n) => {
    _set.add(n)
  })
  
  mt1c.forEach((n) => {
    _set.add(n)
  })
  
  mt2.forEach((n) => {
    _set.add(n)
  })
  
  mt2a.forEach((n) => {
    _set.add(n)
  })
  
  mt2c.forEach((n) => {
    _set.add(n)
  })
  
  mt2d.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt2cLoad = action(conflictingGenerals, 'mt2b load', (store) => {
  const _set = new Set();
  
  mt2c.forEach((n) => {
    _set.add(n)
  })
  
  mt1b.forEach((n) => {
    _set.add(n)
  })
  
  mt2.forEach((n) => {
    _set.add(n)
  })
  
  mt2a.forEach((n) => {
    _set.add(n)
  })
  
  mt2b.forEach((n) => {
    _set.add(n)
  })
  
  mt2d.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt2dLoad = action(conflictingGenerals, 'mt2b load', (store) => {
  const _set = new Set();
  
  mt2d.forEach((n) => {
    _set.add(n)
  })
  
  mt1c.forEach((n) => {
    _set.add(n)
  })
  
  mt2.forEach((n) => {
    _set.add(n)
  })
  
  mt2a.forEach((n) => {
    _set.add(n)
  })
  
  mt2b.forEach((n) => {
    _set.add(n)
  })
  
  mt2c.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt3Load = action(conflictingGenerals, 'm3 load', (store) => {
  const _set = new Set();
  
  mt3.forEach((n) => {
    _set.add(n)
  })
  
  mt3a.forEach((n) => {
    _set.add(n)
  })
  
  mt3b.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt3aLoad = action(conflictingGenerals, 'm3a load', (store) => {
  const _set = new Set();
  
  mt3.forEach((n) => {
    _set.add(n)
  })
  
  mt3a.forEach((n) => {
    _set.add(n)
  })
  
  mt3b.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt3bLoad = action(conflictingGenerals, 'm3a load', (store) => {
  const _set = new Set();
  
  mt3.forEach((n) => {
    _set.add(n)
  })
  
  mt3a.forEach((n) => {
    _set.add(n)
  })
  
  mt3b.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt4Load = action(conflictingGenerals, 'm4 load', (store) => {
  const _set = new Set();
  
  mt4.forEach((n) => {
    _set.add(n)
  })
  
  mt4a.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt4aLoad = action(conflictingGenerals, 'm4a load', (store) => {
  const _set = new Set();
  
  mt4.forEach((n) => {
    _set.add(n)
  })
  
  mt4a.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt5Load = action(conflictingGenerals, 'm5 load', (store) => {
  const _set = new Set();
  
  mt5.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt6Load = action(conflictingGenerals, 'm6 load', (store) => {
  const _set = new Set();
  
  mt6.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt7Load = action(conflictingGenerals, 'm7 load', (store) => {
  const _set = new Set();
  
  mt7.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt8Load = action(conflictingGenerals, 'm8 load', (store) => {
  const _set = new Set();
  
  mt8.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt10Load = action(conflictingGenerals, 'm10 load', (store) => {
  const _set = new Set();
  
  mt10.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt11Load = action(conflictingGenerals, 'm11 load', (store) => {
  const _set = new Set();
  
  mt11.forEach((n) => {
    _set.add(n)
  })
  
  mt11a.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const mt11aLoad = action(conflictingGenerals, 'm11a load', (store) => {
  const _set = new Set();
  
  mt11.forEach((n) => {
    _set.add(n)
  })
  
  mt11a.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})


const at1Load = action(conflictingGenerals, 'at1 load', (store) => {
  const _set = new Set();
  
  at1.forEach((n) => {
    _set.add(n)
  })
  
  gr2b.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const ms1Load = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  ms1.forEach((n) => {
    _set.add(n)
  })
  
  gr6.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr1Load = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr1.forEach((n) => {
    _set.add(n)
  })
  
  gr1a.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr1aLoad = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr1a.forEach((n) => {
    _set.add(n)
  })
  
  gr1.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr2Load = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr2.forEach((n) => {
    _set.add(n)
  })
  
  gr2a.forEach((n) => {
    _set.add(n)
  })
  
  gr2b.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr2aLoad = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr2a.forEach((n) => {
    _set.add(n)
  })
  
  gr1.forEach((n) => {
    _set.add(n)
  })
  
  gr2.forEach((n) => {
    _set.add(n)
  })
  
  gr2b.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr2bLoad = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr2b.forEach((n) => {
    _set.add(n)
  })
  
  gr2.forEach((n) => {
    _set.add(n)
  })
  
  gr2a.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr3Load = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr3.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr4Load = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr4.forEach((n) => {
    _set.add(n)
  })
  
  gr4a.forEach((n) => {
    _set.add(n)
  })
  
  gr4b.forEach((n) => {
    _set.add(n)
  })
  
  gr5.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr4aLoad = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr4a.forEach((n) => {
    _set.add(n)
  })
  
  gr4.forEach((n) => {
    _set.add(n)
  })
  
  gr4b.forEach((n) => {
    _set.add(n)
  })
  
  gr5a.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr4bLoad = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr4b.forEach((n) => {
    _set.add(n)
  })
  
  gr4.forEach((n) => {
    _set.add(n)
  })
  
  gr4a.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr5Load = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr5.forEach((n) => {
    _set.add(n)
  })
  
  gr4.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr5aLoad = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr5a.forEach((n) => {
    _set.add(n)
  })
  
  gr4a.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const gr6Load = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  gr6.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})

const ngLoad = action(conflictingGenerals, 'ms1 load', (store) => {
  const _set = new Set();
  
  ng.forEach((n) => {
    _set.add(n)
  })
  
  let _class: Array<Set<string>>;
  const result = store.get();
  if(result !== undefined && result !== null) {
    _class = result[troopClass.enum.Mounted];
    if(_class === undefined || _class === null) {
      _class = new Array<Set<string>>();
    }
  } else {
    _class = new Array<Set<string>>();
  }
  _class.push(_set);
  store.setKey(troopClass.enum.Mounted,_class);
})
