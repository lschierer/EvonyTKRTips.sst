export function isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
  
type T = /*unresolved*/ any

export function setDifference(setA: Set<T>, setB: Set<T>) {
    const _difference = new Set([...setA]);
    for (const elem of setB) {
      _difference.delete(elem);
    }
    return _difference;
  }
  
export function arrayDifference(a: Array<T>, b: Array<T>) {
    const _difference = new Array();
    for(let i = 0; i < a.length; i++) {
        const v = a[i];
        if(!b.includes(v)) {
            _difference.push(v)
        }
    }
    return _difference;
}   