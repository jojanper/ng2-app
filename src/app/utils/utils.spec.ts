import { type, isEmptyObject, isString } from './utils';

describe('utils.type', () => {
    it('succeeds for valid input', () => {
        const response = type('value');
        expect(response).toEqual('value');
    });

    it('fails for duplicate input', () => {
        type('value2');
        expect(() => type('value2')).toThrowError('Action type "value2" is not unique');
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
