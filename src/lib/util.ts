/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
type T = /*unresolved*/ any;

export function setDifference(setA: Set<T>, setB: Set<T>) {
  const _difference = new Set([...setA]);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

export function arrayDifference(a: T[], b: T[]) {
  const _difference: T[] = [];
  for (const i of a) {
    /* eslint-disable-next-line
         @typescript-eslint/no-unsafe-assignment,
         @typescript-eslint/no-unsafe-member-access
         */
    const v: T = a[i];
    if (!b.includes(v)) {
      _difference.push(v);
    }
  }
  /* eslint-disable-next-line
        @typescript-eslint/no-unsafe-return
    */
  return _difference;
}

export function arrayUniqueFilter(value: any, index: number, self: any[]) {
  // eslint-disable-line
  return self.indexOf(value) === index;
}
