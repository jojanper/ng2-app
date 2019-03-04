/* eslint no-restricted-globals: 0 */
/* global self */
import { WavDecoder } from './wav';


const decoder = new WavDecoder();

self.onmessage = (event) => {
    if (event.data.decode) {
        const decoded = decoder.decode(event.data.decode);
        self.postMessage(decoded, decoded.channelData);
    }
};
