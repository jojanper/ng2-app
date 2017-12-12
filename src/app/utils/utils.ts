// https://github.com/blove/angular-reactive-authentication/blob/master/src/app/core/util.ts
const typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
    if (typeCache[<string>label]) {
        throw new Error(`Action type "${label}" is not unique`);
    }

    typeCache[<string>label] = true;

    return <T>label;
}

export interface UrlParserData {
    [name: string]: string;
}

export function urlParser(url: string): UrlParserData {
    const matches = url.match(/:[^\s/]+/g) || [];

    const mapData: UrlParserData = {};
    matches.forEach((match) => {
        mapData[match] = match.slice(1, match.length);
    });

    return mapData;
}

export function urlMapper(url: string, resolveMap: UrlParserData, resolveData: any): string {
    Object.keys(resolveMap).forEach((key) => {
        const value = resolveMap[key];
        const target = (resolveData) ? resolveData[value] : null;
        if (!target) {
            throw new Error(`Unable to resolve ${url}: Key ${value} not present in input data`);
        }
        url = url.replace(key, target);
    });

    return url;
}

export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function isString(str) {
    return (typeof str === 'string' || str instanceof String);
}
