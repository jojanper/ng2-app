import { type, isEmptyObject, isString, timer } from './utils';

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

    it('timer', async (done) => {
        await timer(100);
        done();
    });

    it('isEmptyObject', () => {
        expect(isEmptyObject({})).toBeTruthy();
    });
});
