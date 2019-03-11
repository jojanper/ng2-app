/* eslint no-restricted-globals: 0 */
/* global self */
import { WavDecoder, PcmDecoder } from './wav';


let decoder = null;

const DECODER_TYPES = {
    'audio/ozoaudio-raw': PcmDecoder,
    'audio/x-wav': WavDecoder,
    'audio/wav': WavDecoder
};

self.onmessage = (event) => {
    // Codec configuration information
    if (event.data.config) {
        const { mime } = event.data.config;
        if (Object.prototype.hasOwnProperty.call(DECODER_TYPES, mime)) {
            decoder = new DECODER_TYPES[event.data.config.mime]();
        } else {
            self.postMessage({error: `Unsupported mime type ${mime}`});
        }

    // Decoding data received -> decode audio
    } else if (decoder && event.data.decode) {
        const decoded = decoder.decode(event.data.decode);
        self.postMessage(decoded, decoded.channelData);
    }
};
