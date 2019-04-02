import { WavDecoder, PcmDecoder, getWavFmtInfo } from './wav';
import { DataReader } from './data';

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

describe('getWavFmtInfo', () => {
    let dataView;
    let reader;

    beforeEach(() => {
        dataView = new DataView(readBuffer);
        reader = new DataReader(dataView);
    });

    it('unsupported format is found', () => {
        writeView[0] = 1;
        writeView[1] = 0;

        expect(() => getWavFmtInfo(reader, 2)).toThrowError(Error, 'Unsupported format in WAV file: 0x100');
    });

    it('fmt chunk is parsed', () => {
        // Format ID
        writeView[0] = 0;
        writeView[1] = 1;

        // Number of channels
        writeView[2] = 0;
        writeView[3] = 2;

        // Sample rate (48000)
        writeView[4] = 0;
        writeView[5] = 0;
        writeView[6] = 187;
        writeView[7] = 128;

        // Byte rate
        writeView[8] = 0;
        writeView[9] = 0;
        writeView[10] = 0;
        writeView[11] = 0;

        // BLock size
        writeView[12] = 0;
        writeView[13] = 4;

        // Bit depth
        writeView[14] = 0;
        writeView[15] = 16;

        const info = getWavFmtInfo(reader, 16);

        expect(info.formatId).toEqual(1);
        expect(info.floatingPoint).toBeFalsy();
        expect(info.numberOfChannels).toEqual(2);
        expect(info.sampleRate).toEqual(48000);
        expect(info.byteRate).toEqual(0);
        expect(info.blockSize).toEqual(4);
        expect(info.bitDepth).toEqual(16);
        expect(info.readerMethodName).toEqual('pcm16');
    });
});
