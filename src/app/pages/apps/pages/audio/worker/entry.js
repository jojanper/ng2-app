import { WavDecoder, PcmDecoder } from './wav';


const decoders = {};

const DECODER_TYPES = {
    'audio/pcm-raw': {
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

export function eventHandler(event, callback) {
    // Codec configuration information
    if (event.data.config) {
        const { mime } = event.data.config;
        if (Object.prototype.hasOwnProperty.call(DECODER_TYPES, mime)) {
            const config = DECODER_TYPES[event.data.config.mime];
            decoders[0] = new config.Cls();
            if (config.samplerate) {
                decoders[0].setAudioConfig(config.samplerate, config.channels);
            }
        } else {
            callback({error: `Unsupported mime type ${mime}`});
        }

    // Decoding data received -> decode audio
    } else if (decoders[0] && event.data.decode) {
        const decoded = decoders[0].decode(event.data.decode);
        callback(decoded, decoded.channelData);
    }
}
