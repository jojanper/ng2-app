import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';

import { EventModel } from '../../models';
import { ApiService, AlertService } from '../../../../../../services';
import { AppObservableObject } from '../../../../../../utils/base';


const TIMELINE_LENGTH = 15000;

const MOCKEVENTS: Array<EventModel> = [
    new EventModel({
        id: 'Seek',
        selectorId: 'Seek forward',
        ts: 1500,
        value: 0
    }),
    new EventModel({
        id: 'Seek',
        selectorId: 'Seek backward',
        ts: 10500,
        value: 0
    })
];


/**
 * Buffer collection container for audio chunks. Handles internal re-buffering
 * in case audio duration drops below buffering threshold.
 */
class AudioRenderBuffers {
    // Audio duration of the buffers
    private duration = 0;

    // Status of the buffering; true if buffers can be consumed, false otherwise
    private canConsume = false;

    // Audio buffers
    private buffers: Array<AudioBuffer>;

    // Buffering threshold in seconds
    private durationThr: number;

    // End of stream flag
    private eos = false;

    /**
     * @param bufferDuration Minimum buffered audio duration, in seconds.
     */
    constructor(bufferDuration) {
        this.buffers = [];
        this.durationThr = bufferDuration;
    }

    /**
     * Include new audio buffer for internal buffering.
     *
     * @param audioBuffer Audio chunk data for playback.
     */
    addBuffer(audioBuffer: AudioBuffer) {
        this.duration += audioBuffer.duration;
        this.buffers.push(audioBuffer);

        // Can the internal buffers be consumed at this point?
        this.canConsume = this.duration > this.durationThr;
    }

    /**
     * Return audio buffer for playback. Return value null indicates that no audio
     * is available for playback.
     */
    getBuffer() {
        if (!this.buffering) {
            const buffer = this.buffers.shift();
            this.duration -= buffer.duration;
            return buffer;
         }

         return null;
    }

    /**
     * Set end-of-stream, no more audio buffers are to be added.
     */
    setEndOfStream() {
        this.eos = true;
    }

    /**
     * Return true if re-buffering state is enabled, false otherwise.
     */
    get buffering(): boolean {
        if (this.eos) {
            return !(this.buffers.length > 0);
        }

        return (this.canConsume && this.buffers.length > 0) ? false : true;
    }
}

export const PlaybackStates = {
    PLAY: 'play',
    PAUSE: 'pause'
};

export interface PlaybackState {
    state: string;
}

export class PlaybackStateObserver extends AppObservableObject<PlaybackState> {
    setPlay(): void {
        this.setObject({state: PlaybackStates.PLAY});
    }

    setPause(): void {
        this.setObject({state: PlaybackStates.PAUSE});
    }
}

export class NumberValueObserver extends AppObservableObject<number> { }


class AudioRenderer {
    private stateObserver = new PlaybackStateObserver();
    private posObserver = new NumberValueObserver();
    private buffers: AudioRenderBuffers;
    private audioCtx: AudioContext;
    private audioSrcNodes: Array<AudioBufferSourceNode> = [];
    private nodesEnded = 0;
    private nodesCreated = 0;
    private playPos = 0;
    private playStartedAt = 0;
    private eos = false;

    constructor(bufferDuration) {
        this.buffers = new AudioRenderBuffers(bufferDuration);
        this.audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();
    }

    get stateObservable() {
        return this.stateObserver.asPipe();
    }

    get posObservable(): Observable<number> {
        return this.posObserver.asPipe();
    }

    /**
     * Signal end of stream.
     */
    setEndOfStream() {
        this.eos = true;
        this.buffers.setEndOfStream();
        this.flush();
    }

    /**
     * Add new audio data for rendering.
     */
    scheduleRender({channelData, length, numChannels, sampleRate}) {
        const audioBuffer = this.audioCtx.createBuffer(numChannels, length, sampleRate);

        for (let c = 0; c < numChannels; c++) {
            if (audioBuffer.copyToChannel) {
                audioBuffer.copyToChannel(channelData[c], c);
            } else {
                const toChannel = audioBuffer.getChannelData(c);
                for (let i = 0; i < channelData[c].byteLength; i++) {
                    toChannel[i] = channelData[c][i];
                }
            }
        }

        this.buffers.addBuffer(audioBuffer);
        this.flush();
    }

    /**
     * Send all available audio buffers for playback.
     */
    flush() {
        let audioBuffer = this.buffers.getBuffer();
        while (audioBuffer) {
            this.scheduleAudioBuffer(audioBuffer);
            audioBuffer = this.buffers.getBuffer();
        }
    }

    /**
     * Return true if audio is playing, false otherwise.
     */
    get isPlaying() {
        return this.audioCtx.state === 'running';
    }

    /**
     * Return true if audio is paused, false otherwise.
     */
    get isPause() {
        return this.audioCtx.state === 'suspended';
    }

    /**
     * Close audio rendering and related resources.
     */
    close() {
        if (this.audioCtx) {
            this.audioCtx.close();
        }

        this.stateObserver.closeSubject();
        this.posObserver.closeSubject();
    }

    /**
     * Switch playback state.
     * 'stateObserver' property status is changed accordingly.
     */
    async togglePlayback() {
        if (this.isPlaying) {
            await this.audioCtx.suspend();
            this.stateObserver.setPause();
        } else if (this.isPause) {
            await this.audioCtx.resume();
            this.stateObserver.setPlay();
        }
    }

    /**
     * System has finished playing specified audio buffer.
     */
    private onAudioNodeEnded(audioBuffer) {
        this.audioSrcNodes.shift();
        this.nodesEnded++;

        this.playPos = this.playPos + audioBuffer.duration;
        this.posObserver.setObject(this.playPos);

        const nodesLeft = this.nodesCreated - this.nodesEnded;
        if (!this.eos && nodesLeft === 0 && this.buffers.buffering) {
            this.playStartedAt = 0;
        }
    }

    /**
     * Add new audio buffer for playback.
     */
    private scheduleAudioBuffer(audioBuffer) {
        const audioSrc = this.audioCtx.createBufferSource();

        // Ensure onended callback is fired in Safari
        if (window['webkitAudioContext']) {
            this.audioSrcNodes.push(audioSrc);
        }

        // Initialize first play position, introduce some delay to ensure smooth playback
        if (!this.playStartedAt) {
            const startDelay = (this.audioCtx.baseLatency || 128 / this.audioCtx.sampleRate);
            this.playStartedAt = this.audioCtx.currentTime + audioBuffer.duration + startDelay;
        }

        audioSrc.onended = () => this.onAudioNodeEnded(audioBuffer);
        audioSrc.buffer = audioBuffer;
        audioSrc.connect(this.audioCtx.destination);
        audioSrc.start(this.playStartedAt);
        this.playStartedAt += audioBuffer.duration;
        this.nodesCreated++;
    }
}

class DataChunkDownloader {
    private downloadValue = 0;
    private downloadValueObserver = new NumberValueObserver();

    constructor(public worker, public bufferSize = 32 * 1024) {}

    get downloadObservable(): Observable<number> {
        return this.downloadValueObserver.observable;
    }

    start(url: string, endCallback): Promise<any> {
        this.downloadValueObserver.setObject(this.downloadValue);
        return fetch(url).then(this.parseStream.bind(this)).then(endCallback);
    }

    attachListener(cb: Function) {
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

    private flushBuffer(readBuffer: ArrayBuffer, bytesAvailable: number): number {
        const buffer = readBuffer.slice(0, bytesAvailable);
        this.worker.postMessage({decode: buffer}, [buffer]);
        return 0;
    }
}


@Component({
    selector: 'dng-audio-events',
    templateUrl: './audioevents.component.html'
})
export class AudioEventsComponent implements OnDestroy, OnInit {
    events: Array<EventModel> = [];
    timelineLength = TIMELINE_LENGTH;

    @ViewChild('elapsed') private el: ElementRef;

    worker: Worker;
    renderer = new AudioRenderer(2.5);
    dataDownloader: DataChunkDownloader;
    downloadProgress: Observable<number>;

    constructor(private api: ApiService, private alert: AlertService) {
        this.worker = new Worker('/assets/scripts/worker.js');
        this.dataDownloader = new DataChunkDownloader(this.worker);
        this.dataDownloader.attachListener(data => this.renderer.scheduleRender(data));
        this.downloadProgress = this.dataDownloader.downloadObservable;
    }

    ngOnInit() {
        this.api.network.get('/audio-events').subscribe(
            (events) => {
                (events as []).forEach(event => this.events.push(new EventModel(event)));
            },
            () => MOCKEVENTS.forEach(event => this.events.push(event))
        );

        const url = '/audio-files/house-41000hz-trim.wav';

        const observable = from(this.dataDownloader.start(url, () => {
            this.renderer.setEndOfStream();
        }));

        observable.subscribe(
            () => {},
            err => this.alert.error(err)
        );

        this.renderer.posObservable.subscribe((pos) => {
            this.el.nativeElement.innerHTML = Math.round(pos);
        });
    }

    ngOnDestroy() {
        this.renderer.close();

        if (this.worker) {
            this.worker.terminate();
        }
    }
}
