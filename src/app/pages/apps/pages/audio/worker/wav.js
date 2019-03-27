import { DataReader } from './data';

function getWavFmtInfo(reader, chunkSize) {
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

export class PcmDecoder {
    constructor() {
        this.blockSize = 4;
        this.sampleRate = 48000;
        this.numberOfChannels = 2;
        this.readerMethodName = 'pcm16';
    }

    setAudioConfig(samplerate, channels) {
        this.sampleRate = samplerate;
        this.numberOfChannels = channels;
        this.blockSize = 2 * this.numberOfChannels;
    }

    decode(arrayBuffer) {
        const dataView = new DataView(arrayBuffer);

        const reader = new DataReader(dataView);
        if (this.init) {
            this.init(reader);
        }

        const chunkSize = reader.remain();
        const length = Math.floor(chunkSize / this.blockSize);
        const channelData = new Array(this.numberOfChannels);

        for (let ch = 0; ch < this.numberOfChannels; ch++) {
            channelData[ch] = new Float32Array(length);
        }

        const read = reader[this.readerMethodName].bind(reader);

        for (let i = 0; i < length; i++) {
            for (let ch = 0; ch < this.numberOfChannels; ch++) {
                channelData[ch][i] = read();
            }
        }

        return {
            channelData: channelData.map(arr => arr.buffer),
            length,
            numChannels: this.numberOfChannels,
            sampleRate: this.sampleRate
        };
    }
}

export class WavDecoder extends PcmDecoder {
    constructor() {
        super();
        this.length = 0;
        this.readerMeta = null;
    }

    init(reader) {
        // WAVE header already read
        if (this.readerMeta) {
            return;
        }

        if (reader.string(4) !== 'RIFF') {
            throw new Error('Invalid WAV file, no RIFF found');
        }

        // File length
        this.length = reader.uint32();

        if (reader.string(4) !== 'WAVE') {
            throw new Error('Invalid WAV file, no WAVE found');
        }

        let dataFound = false;

        do {
            const chunkType = reader.string(4);
            const chunkSize = reader.uint32();

            switch (chunkType) {
            case 'fmt ':
                this.readerMeta = getWavFmtInfo(reader, chunkSize);
                break;

            case 'data':
                dataFound = true;
                break;

            default:
                reader.skip(chunkSize);
                break;
            }
        } while (!dataFound && reader.remain());

        this.blockSize = this.readerMeta.blockSize;
        this.sampleRate = this.readerMeta.sampleRate;
        this.numberOfChannels = this.readerMeta.numberOfChannels;
        this.readerMethodName = this.readerMeta.readerMethodName;
    }
}
