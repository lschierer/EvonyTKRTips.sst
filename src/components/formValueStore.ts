import {  atom } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import { logger } from '@nanostores/logger'

type FormValues = Record<string, number|string|boolean>;

export const formValues = persistentAtom<FormValues[]>('evonyTKRTips', [], {
  listen: false,
  encode: JSON.stringify,
  decode: JSON.parse,
})

const destroy = logger({
  'FormValues': formValues,
})

export function formInit () {
  formValues.set([]);
}

export function addValue (mykey: string, v: string|number|boolean) {
  const returnable = new Map<string, number|string|boolean>();
  const mystore = formValues.get();
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
  formValues.set(storable);
};

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