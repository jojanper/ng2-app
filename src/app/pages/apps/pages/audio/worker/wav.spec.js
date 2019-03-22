import { WavDecoder, PcmDecoder } from './wav';


const NSIZE = 6;
const readBuffer = new ArrayBuffer(NSIZE);
const writeView = new Uint8Array(readBuffer);

describe('PcmDecoder', () => {
    beforeAll(() => {
        writeView[0] = 3;
        writeView[1] = 2;
        writeView[2] = 8;
        writeView[3] = 0;
        writeView[4] = 1;
        writeView[5] = 2;
    });

    it('decode 16-bit audio', () => {
        const obj = new PcmDecoder();
        obj.setAudioConfig(48000, 3);

        const result = obj.decode(readBuffer);
        const audio = result.channelData.map(arrBuffer => new Float32Array(arrBuffer));

        expect(result.length).toEqual(1); // One audio sample available
        expect(result.numChannels).toEqual(3);
        expect(result.sampleRate).toEqual(48000);
        expect(result.channelData.length).toEqual(3);

        expect(audio[0][0]).toEqual((2 * 256 + 3) / 32768);
        expect(audio[1][0]).toEqual((0 * 256 + 8) / 32768);
        expect(audio[2][0]).toEqual((2 * 256 + 1) / 32768);
    });
});

describe('WavDecoder', () => {
    it('works', () => {
        const obj = new WavDecoder();

        expect(obj).toBeDefined();
    });
});
