import {
  generalSchema,
  type General,
  generalObjectSchema,
  type generalObject,
  troopClass,
  type troopClassType,
} from '@schemas/evonySchemas.ts';

import {map, action} from "nanostores";
import {z} from "zod";


const letters = new Set(["a","b","c"]);


export const conflictingGenerals = map<Record<troopClassType,Set<string>[]>>();

export const initialLoad = action(conflictingGenerals, 'initial Load', (store) => {
  mountLoad();
  let tmp = (conflictingGenerals.get())[troopClass.enum.Mounted];
})

export function checkConflicts (name1: string, name2: string, generalClass?: troopClassType) {
  if(name1 === name2 || !name1.localeCompare(name2, undefined, {sensitivity: 'base'})) {
    return true;
  }
  let records = conflictingGenerals.get()
  if(records !== null && records !== undefined) {
    if(generalClass !== undefined && generalClass !== null && generalClass !== troopClass.enum.all ) {
      const sets = records[generalClass];
      if(sets !== null && sets !== undefined) {
        const setResult =  sets.map((s) => {
          if(s.has(name1)) {
            if(s.has(name2)) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        })
        return setResult.includes(true);
      }
    }
    let types = new Array<troopClassType>();
    types.push(troopClass.enum.Mounted);
    types.push(troopClass.enum.Ground);
    types.push(troopClass.enum.Archers);
    types.push(troopClass.enum.Siege);
    
    const typesResult =  types.map((t) => {
      let sets:Set<string>[] = records[t];
      if(sets !== null && sets !== undefined) {
        const setResult = sets.map((s) => {
          if (s.has(name1)) {
            if (s.has(name2)) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        })
        return setResult.includes(true);
      }
    })
    return typesResult.includes(true);
  }
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
