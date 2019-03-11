import { DataReader } from './data';


const NSIZE = 32;
const readBuffer = new ArrayBuffer(NSIZE);
const writeView = new Uint8Array(readBuffer);
writeView[0] = 3;

const dataView = new DataView(readBuffer);

describe('DataReader', () => {
    let reader;

    beforeEach(() => {
        reader = new DataReader(dataView);
    });

    it('works', () => {
        const obj = new DataReader();
        expect(obj).toBeDefined();
    });

    it('remain', () => {
        expect(reader.remain()).toEqual(NSIZE);
    });

    it('skip', () => {
        reader.skip(2);
        expect(reader.remain()).toEqual(NSIZE - 2);
    });

    it('uint8', () => {
        expect(reader.uint8()).toEqual(3);
    });
});
