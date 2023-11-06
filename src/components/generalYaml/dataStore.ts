import { action, atom } from 'nanostores'
import { logger } from '@nanostores/logger'

type FormValues = Map<string, number|string>;

export const formValues = atom<FormValues>(new Map<string, number|string>());

let destroy = logger({
  'FormValues': formValues,
})

export const addValue = action(formValues, 'AddValue', (store, mykey: string, v: string|number) => {
  let mystore = store.get();
  if(mystore === null) {
    console.log(`creating new map`)
    mystore = new Map<string, number|string>;
  }
  mystore.set(mykey, v);
  return mystore;
});

