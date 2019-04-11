import { WavDecoder, PcmDecoder } from './wav';


let decoder = null;

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

export function eventHandler(event, callback) {
    // Codec configuration information
    if (event.data.config) {
        const { mime } = event.data.config;
        if (Object.prototype.hasOwnProperty.call(DECODER_TYPES, mime)) {
            const config = DECODER_TYPES[event.data.config.mime];
            decoder = new config.Cls();
            if (config.samplerate) {
                const samplerate = event.data.config.samplerate || config.samplerate;
                const channels = event.data.config.channels || config.channels;
                decoder.setAudioConfig(samplerate, channels);
            }

            callback({ config: decoder.getAudioConfig() });
        } else {
            callback({ error: `Unsupported mime type ${mime}` });
        }

        // Decoding data received -> decode audio
    } else if (decoder && event.data.decode) {
        const decoded = decoder.decode(event.data.decode);
        callback(decoded, decoded.channelData);
    }
}
