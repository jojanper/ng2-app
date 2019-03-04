import { WavDecoder } from './wav';


describe('WavDecoder', () => {
    it('works', () => {
        const obj = new WavDecoder();

        expect(obj).toBeDefined();
    });
});
