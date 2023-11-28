import { action, atom } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import { logger } from '@nanostores/logger'

type FormValues = Record<string, number|string|boolean>;

export const formValues = persistentAtom<FormValues[]>('evonyTKRTips', [], {
  listen: false,
  encode: JSON.stringify,
  decode: JSON.parse,
})

let destroy = logger({
  'FormValues': formValues,
})

export const formInit = action(formValues, 'initialize',(store) => {
  store.set([]);
})

export const addValue = action(formValues, 'AddValue', (store, mykey: string, v: string|number|boolean) => {
  const returnable = new Map<string, number|string|boolean>();
  let mystore = store.get();
  if(mystore !== null) {
    mystore.forEach((val) => {
      const k = Object.keys(val)[0];
      returnable.set(k,val[k] );
    })

  }
  returnable.set(mykey, v);
  const storable = new Array<FormValues>();
  returnable.forEach((value, key, map) => {
    const nv:FormValues = {[key]: value}
    storable.push(nv);
  })
  store.set(storable);
});

export const getValue = (mykey: string) => {
  const values = new Map<string, number|string|boolean>();
  const storedValues = formValues.get();
  if(storedValues !== null && storedValues !== undefined) {
    storedValues.forEach((val) => {
      const k = Object.keys(val)[0];
      values.set(k,val[k]);
    })
    return values.get(mykey);
  }
  return null;
}