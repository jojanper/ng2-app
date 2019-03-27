import { WavDecoder, PcmDecoder } from './wav';


const NSIZE = 26;
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

        expect(result.length).toEqual(4); // Audio samples available
        expect(result.numChannels).toEqual(3);
        expect(result.sampleRate).toEqual(48000);
        expect(result.channelData.length).toEqual(3);

        expect(audio[0][0]).toEqual((2 * 256 + 3) / 32768);
        expect(audio[1][0]).toEqual((0 * 256 + 8) / 32768);
        expect(audio[2][0]).toEqual((2 * 256 + 1) / 32768);
    });
});

describe('WavDecoder', () => {
    let obj;

    beforeEach(() => {
        obj = new WavDecoder();
    });

    it('no RIFF', () => {
        writeView[0] = 'R'.charCodeAt(0);
        writeView[1] = 'A'.charCodeAt(0);
        writeView[2] = 'F'.charCodeAt(0);
        writeView[3] = 'F'.charCodeAt(0);

        expect(() => obj.decode(readBuffer)).toThrowError(Error, 'Invalid WAV file, no RIFF found');
    });

    it('no WAVE', () => {
        writeView[0] = 'R'.charCodeAt(0);
        writeView[1] = 'I'.charCodeAt(0);
        writeView[2] = 'F'.charCodeAt(0);
        writeView[3] = 'F'.charCodeAt(0);

        writeView[4] = 0;
        writeView[5] = 0;
        writeView[6] = 0;
        writeView[7] = 1;

        writeView[8] = 'W'.charCodeAt(0);
        writeView[9] = 'A'.charCodeAt(0);
        writeView[10] = 'V'.charCodeAt(0);
        writeView[11] = 'I'.charCodeAt(0);

        expect(() => obj.decode(readBuffer)).toThrowError(Error, 'Invalid WAV file, no WAVE found');
    });
});
