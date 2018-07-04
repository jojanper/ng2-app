// https://github.com/blove/angular-reactive-authentication/blob/master/src/app/core/util.ts
const typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
    if (typeCache[<string>label]) {
        throw new Error(`Action type "${label}" is not unique`);
    }

    typeCache[<string>label] = true;

    return <T>label;
}

export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function isString(str) {
    return (typeof str === 'string' || str instanceof String);
}
