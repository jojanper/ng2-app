import { type, urlParser, urlMapper, UrlParserData,
    isEmptyObject, isString } from './utils';

describe('utils.type', () => {
    it('succeeds for valid input', () => {
        const response = type('value');
        expect(response).toEqual('value');
    });

    it('fails for duplicate input', () => {
        expect(() => type('value')).toThrowError('Action type "value" is not unique');
    });
});

describe('utils.urlParser', () => {
    it('succeeds to parse URL string', () => {
        const response = urlParser('/data/test/:testid/:key');
        expect(response).toEqual({
            ':testid': 'testid',
            ':key': 'key'
        } as any);
    });
});

describe('utils.urlMapper', () => {
    const resolveMap = {':testid': 'testid'} as UrlParserData;

    it('fails when missing data is encountered', () => {
        expect(() => urlMapper('/data/test/:testid', resolveMap, null))
            .toThrowError('Unable to resolve /data/test/:testid: Key testid not present in input data');
    });

    it('succeeds', () => {
        expect(urlMapper('/data/test/:testid', resolveMap, {testid: 1})).toEqual('/data/test/1');
    });
});

describe('utils', () => {
    it('isEmptyObject', () => {
        expect(isEmptyObject({})).toBeTruthy();
    });

    it('isString', () => {
        expect(isString({})).toBeFalsy();
        expect(isString('foo')).toBeTruthy();
    });
});
