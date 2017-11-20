import { type } from './utils';

describe('type', () => {
    it('succeeds for valid input', () => {
        const response = type('value');
        expect(response).toEqual('value');
    });

    it('fails for duplicate input', () => {
        expect(() => type('value')).toThrowError('Action type "value" is not unique');
    });
});
