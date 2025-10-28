import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";

const cloneObject = (obj: any): any =>
    (Array.isArray(obj) ? Object.values : (obj: any) => obj)(Object.entries(obj).reduce((acc: any, [key, val]) =>
    ({
        ...acc, [key]: (
            !val ? val
                : typeof val === 'object' ? cloneObject(val)
                    : val
        ),
    }),
        {},
    ));

const checkObjectType = (obj: any) =>
    // Object(obj) === obj && !Array.isArray(obj) 
    // obj instanceof Object && !(obj instanceof Array) && obj !== null
    typeof obj === 'object' && obj !== null && !Array.isArray(obj);

/*
const joinKeys = (...keys2join: any) =>
    keys2join.join('.');
*/

const listKeys = (obj: any, keys: any = []): any =>
    Object.keys(obj).reduce((acc: any, key) =>
        checkObjectType(obj[key])
            ? [...acc, ...listKeys(obj[key], [...keys, key])]
            // : [...acc, joinKeys(...keys, key)]
            : [...acc, [...keys, key]]
        , [],
    );

const path2Keys = (obj: any): any =>
    Object(obj) === obj
        ? Object.entries(obj).flatMap(([k, v]) => path2Keys(v).map((p: any) => [k, ...p]))
        : [[]];

const renameKeys = (obj: any, map: any) =>
(Object.keys(obj).reduce((acc, key) => {
    if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map((item: any) => renameKeys(item, map));
    } else if (typeof obj[key] === 'object') {
        obj[key] = renameKeys(obj[key], map);
    }
    return {
        ...acc, [map[key] || key]: obj[key],
    };
}, {}));


const renameKeysXXX = (obj: any, map: any): any =>
    (Array.isArray(obj) ? Object.values : (obj: any) => obj)(Object.keys(obj).reduce((acc, key) =>
    ({
        ...acc, [map[key] || key]: (
            (typeof obj[key] === 'object') ?
                obj[key] = renameKeysXXX(obj[key], map)
                : obj[key]
        )
    }), {}));

const anagrams = (input: string) => {
    const result: any = [];
    if (input.length === 1) {
        result.push(input);
        return result;
    }
    for (let i = 0; i < input.length; i++) {
        const first = input[i];
        const left = input.substring(0, i) + input.substring(i + 1);
        const next = anagrams(left);
        for (let j = 0; j < next.length; j++) {
            result.push(first + next[j]);
        }
    }
    return result;
}

const props2remove = [undefined, null, NaN, ''];

const remove_null_empty = (obj: any, to_remove = props2remove): any => {
    if (to_remove.includes(obj)) return;

    if (Array.isArray(obj))
        return obj
            .map(v => v && typeof v === 'object' ? remove_null_empty(v, to_remove) : v)
            .filter(v => !to_remove.includes(v));

    return Object.entries(obj).length
        ? Object.entries(obj)
            .map(([k, v]) => ([k, v && typeof v === 'object' ? remove_null_empty(v, to_remove) : v]))
            .reduce((a, [k, v]) => (to_remove.includes(v) ? a : { ...a, [k]: v }
            ), {})
        : obj;
}

const reduce_null_empty = (o: any, p2r = props2remove): any =>
    (Array.isArray(o) ? Object.values : (o: any) => o)(Object.keys(o).reduce((acc, key) => (
            (p2r.includes(o[key]))
                ? acc
                : {
                    ...acc, [key]: (
                        (typeof o[key] === 'object' && o[key] !== null)
                            ? o[key] = reduce_null_empty(o[key], p2r)
                            : o[key]
                    )
                }), {}));

const remove_objects = (o: any) => {
    for (const k in o) {
        if (!o[k] || typeof o[k] !== "object") {
            continue
        }

        remove_objects(o[k]);
        if (Object.keys(o[k]).length === 0) {
            delete o[k];
        }
    }
    return o;
}

export function isControlValueEmpty(control: AbstractControl): boolean {
    if (control instanceof FormControl) {
      const value = control.value;
      return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
    } else if (control instanceof FormGroup) {
      return Object.keys(control.controls).every(key => isControlValueEmpty(control.controls[key]));
    } else if (control instanceof FormArray) {
      return control.controls.every(ctrl => isControlValueEmpty(ctrl));
    } else if (typeof control === 'object' && control !== null) {
      // Ensure the object is a FormGroup before accessing controls by key
      if (control instanceof FormGroup) {
        return Object.keys(control.controls).every(key => isControlValueEmpty(control.controls[key]));
      }
      // Handle other object types if necessary
      return Object.keys(control).every(key => isControlValueEmpty((control as any)[key]));
    }
    return true;
  }



export {
    cloneObject,
    listKeys,
    path2Keys,
    renameKeys,
    renameKeysXXX,
    anagrams,
    reduce_null_empty,
    remove_null_empty,
    remove_objects
};
