import { DataReader } from './data';

function getWavInfo(reader, chunkSize) {
    const formats = {
        0x0001: 'lpcm',
        0x0003: 'lpcm'
    };

    const formatId = reader.uint16();

    if (!Object.prototype.hasOwnProperty.call(formats, formatId)) {
        return new TypeError(`Unsupported format in WAV file: 0x${formatId.toString(16)}`);
    }

    const meta = {
        formatId,
        floatingPoint: formatId === 0x0003,
        numberOfChannels: reader.uint16(),
        sampleRate: reader.uint32(),
        byteRate: reader.uint32(),
        blockSize: reader.uint16(),
        bitDepth: reader.uint16(),
        readerMethodName: null
    };
    reader.skip(chunkSize - 16);

    const decoderOption = meta.floatingPoint ? 'f' : '';
    meta.readerMethodName = `pcm${meta.bitDepth}${decoderOption}`;

    if (!reader[meta.readerMethodName]) {
        return new TypeError(`Not supported bit depth: ${meta.bitDepth}`);
    }

    return meta;
}

export class WavDecoder {
    constructor() {
        this.readerMeta = null;
    }

    decode(arrayBuffer) {
        const dataView = new DataView(arrayBuffer);

        const reader = new DataReader(dataView);
        if (!this.readerMeta) {
            this.init(reader);
        }

        const { blockSize, sampleRate, numberOfChannels } = this.readerMeta;

        const chunkSize = reader.remain();
        const length = Math.floor(chunkSize / blockSize);
        const channelData = new Array(numberOfChannels);

        for (let ch = 0; ch < numberOfChannels; ch++) {
            channelData[ch] = new Float32Array(length);
        }

        const read = reader[this.readerMeta.readerMethodName].bind(reader);

        for (let i = 0; i < length; i++) {
            for (let ch = 0; ch < numberOfChannels; ch++) {
                channelData[ch][i] = read();
            }
        }

        return {
            channelData: channelData.map(arr => arr.buffer),
            length,
            numChannels: numberOfChannels,
            sampleRate
        };
    }

    init(reader) {
        if (reader.string(4) !== 'RIFF') {
            throw new TypeError('Invalid WAV file');
        }

        reader.uint32(); // skip file length

        if (reader.string(4) !== 'WAVE') {
            throw new TypeError('Invalid WAV file');
        }

        let dataFound = false;

        do {
            const chunkType = reader.string(4);
            const chunkSize = reader.uint32();

            switch (chunkType) {
            case 'fmt ':
                this.readerMeta = getWavInfo(reader, chunkSize);
                break;

            case 'data':
                dataFound = true;
                break;

            default:
                reader.skip(chunkSize);
                break;
            }
        } while (!dataFound);
    }
}