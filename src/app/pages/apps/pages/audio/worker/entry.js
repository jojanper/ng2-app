import { WavDecoder, PcmDecoder } from './wav';


// Available audio decoders according to (MIME) types
const DECODER_TYPES = {
    'audio/pcm': {
        Cls: PcmDecoder,
        samplerate: 48000,
        channels: 2
    },
    'audio/x-wav': {
        Cls: WavDecoder
    },
    'audio/wav': {
        Cls: WavDecoder
    }
};

function errorHandler(msg, callback) {
    callback({ error: msg });
}

class AudioEventHandler {
    constructor() {
        this.decoder = null;
    }

    handleEvent(event, callback) {
        const method = `_${event.data.name}Handler`;
        if (this[method]) {
            this[method].call(this, event.data.data, callback);
            return;
        }

        errorHandler(`No event handler found for '${event.data.name}'`, callback);
    }

    // Codec configuration information
    _configHandler(data, callback) {
        const { mime } = data;

        if (Object.prototype.hasOwnProperty.call(DECODER_TYPES, mime)) {
            const config = DECODER_TYPES[mime];
            this.decoder = new config.Cls();
            if (config.samplerate) {
                const samplerate = data.samplerate || config.samplerate;
                const channels = data.channels || config.channels;
                this.decoder.setAudioConfig(samplerate, channels);
            }

            callback({ config: this.decoder.getAudioConfig() });
        } else {
            errorHandler(`Unsupported mime type ${mime}`, callback);
        }
    }

    // Decoding data received -> decode audio
    _decodeHandler(data, callback) {
        if (this.decoder) {
            const decoded = this.decoder.decode(data.decode);
            callback(decoded);
        }
    }
}

const decoder = new AudioEventHandler();

export function eventHandler(event, callback) {
    decoder.handleEvent(event, callback);
}
