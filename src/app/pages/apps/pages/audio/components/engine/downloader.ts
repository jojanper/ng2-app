import { Observable } from 'rxjs';

import { DecodedData } from './interfaces';
import { NumberValueObserver } from '../../../../../../utils/base';


export type DecodedDataCallback = (data: DecodedData) => void;

/**
 * Download data from specified URL in chunks and pass received data
 * to target worker.
 */
export class DataChunkDownloader {
    private downloadValue = 0;
    private downloadValueObserver = new NumberValueObserver();

    /**
     *
     * @param worker Target worker for the input data chunks.
     * @param bufferSize Size of data chunks in bytes.
     */
    constructor(public worker, public bufferSize = 32 * 1024) {}

    /**
     * Return download progress as observable.
     */
    get downloadObservable(): Observable<number> {
        return this.downloadValueObserver.observable;
    }

    /**
     * Start chunk data downloading from specified URL.
     *
     * @param url Target URL.
     * @param endCallback Callback function for end-of-stream event.
     */
    start(url: string, endCallback: () => void): Promise<any> {
        this.downloadValueObserver.setObject(this.downloadValue);
        return fetch(url).then(this.parseStream.bind(this)).then(endCallback);
    }

    /**
     * Attach listener for receiving decoded data chunks from worker.
     *
     * @param cb Listener callback.
     */
    attachListener(cb: DecodedDataCallback) {
        this.worker.onmessage = (event) => {
            // Decode data available
            if (event.data.channelData) {
              const decoded = event.data;

              // Convert Transferrable ArrayBuffer to Float32Array
              decoded.channelData = decoded.channelData.map(arrBuffer => new Float32Array(arrBuffer));
              cb(decoded);
            }
        };
    }

    // Parse remote response as ReadableStream
    private parseStream(response) {
        if (!response.ok) {
            throw Error(`${response.url}: ${response.status} ${response.statusText}`);
        }

        if (!response.body) {
            throw Error('ReadableStream not yet supported in this browser');
        }

        const reader = response.body.getReader();
        const contentLength = response.headers.get('content-length');
        const bytesTotal = contentLength ? parseInt(contentLength, 10) : 0;

        // Received bytes are stored here
        const readBuffer = new ArrayBuffer(this.bufferSize);
        const readBufferView = new Uint8Array(readBuffer);

        let bytesRead = 0;
        let readBufferPos = 0;

        // Fill buffer and flush to worker when full
        const read = () => {
            return reader.read().then(({value, done}) => {
                if (done) {
                    readBufferPos = this.flushBuffer(readBuffer, readBufferPos);
                    return;
                }

                // Update download progress
                bytesRead += value.byteLength;
                this.downloadValue = Math.round(100 * (bytesRead / bytesTotal));
                this.downloadValueObserver.setObject(this.downloadValue);

                // Copy received bytes and flush when needed
                for (const byte of value) {
                    readBufferView[readBufferPos++] = byte;
                    if (readBufferPos === this.bufferSize) {
                        readBufferPos = this.flushBuffer(readBuffer, readBufferPos);
                    }
                }

                return read();
            });
        };

        return read();
    }

    // Send data chunk to worker for processing
    private flushBuffer(readBuffer: ArrayBuffer, bytesAvailable: number): number {
        const buffer = readBuffer.slice(0, bytesAvailable);
        this.worker.postMessage({decode: buffer}, [buffer]);
        return 0;
    }
}
