import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';

import { EventModel } from '../../models';
import { ApiService } from '../../../../../../services';


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

class AudioRenderer {
    private buffers: AudioRenderBuffers;
    private audioCtx: AudioContext;
    private audioSrcNodes: Array<AudioBufferSourceNode> = [];
    private nodesEnded = 0;
    private nodesCreated = 0;
    private playPos = 0;
    private playStartedAt = 0;
    private eos = false;
    private playPosCb: Function;

    constructor(bufferDuration) {
        this.buffers = new AudioRenderBuffers(bufferDuration);
        this.audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();
        this.playPosCb = null;
    }

    /**
     * Signal end of stream.
     */
    setEndOfStream() {
        this.eos = true;
        this.buffers.setEndOfStream();
    }

    setPlayposCallback(cb) {
        this.playPosCb = cb;
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
                let toChannel = audioBuffer.getChannelData(c);
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

    async togglePlayback() {
        if (this.isPlaying) {
            await this.audioCtx.suspend();
        } else if (this.isPause) {
            await this.audioCtx.resume();
        }
    }

    /**
     * Close audio rendering and related resources.
     */
    close() {
        if (this.audioCtx) {
            this.audioCtx.close();
        }
    }

    /**
     * Add new audio buffer for playback.
     */
    private scheduleAudioBuffer(audioBuffer) {
        const audioSrc = this.audioCtx.createBufferSource();

        const onAudioNodeEnded = () => {
            this.audioSrcNodes.shift();
            this.nodesEnded++;

            this.playPos = this.playPos + audioBuffer.duration;
            if (this.playPosCb) {
                this.playPosCb(this.playPos);
            }

            const nodesLeft = this.nodesCreated - this.nodesEnded;
            if (!this.eos && nodesLeft === 0 && this.buffers.buffering) {
                this.playStartedAt = 0;
            }
        }

        audioSrc.onended = onAudioNodeEnded;
        this.nodesCreated++;

        // Ensure onended callback is fired in Safari
        if (window['webkitAudioContext']) {
            this.audioSrcNodes.push(audioSrc);
        }

        // Initialize first play position, introduce some delay to ensure smooth playback
        if (!this.playStartedAt) {
            const startDelay = (this.audioCtx.baseLatency || 128 / this.audioCtx.sampleRate);
            this.playStartedAt = this.audioCtx.currentTime + audioBuffer.duration + startDelay;
        }

        audioSrc.buffer = audioBuffer;
        audioSrc.connect(this.audioCtx.destination);
        audioSrc.start(this.playStartedAt);
        this.playStartedAt += audioBuffer.duration;
    }
}


@Component({
    selector: 'dng-audio-events',
    templateUrl: './audioevents.component.html'
})
export class AudioEventsComponent implements OnDestroy, OnInit {
    downloadValue = 0;
    events: Array<EventModel> = [];
    timelineLength = TIMELINE_LENGTH;

    @ViewChild('elapsed') private el: ElementRef;

    worker: Worker;
    renderer = new AudioRenderer(2.5);

    constructor(private api: ApiService) {
        this.worker = new Worker('/assets/scripts/worker.js');

        this.worker.onmessage = event => {
            if (event.data.channelData) {
              const decoded = event.data;

              // convert Transferrable ArrayBuffer to Float32Array
              decoded.channelData = decoded.channelData.map(arrayBuffer => new Float32Array(arrayBuffer));
              this.renderer.scheduleRender(decoded)
            }
        }
    }

    ngOnInit() {
        this.api.network.get('/audio-events').subscribe(
            (events) => {
                (events as []).forEach(event => this.events.push(new EventModel(event)));
            },
            () => MOCKEVENTS.forEach(event => this.events.push(event))
        );

        //fetch('/audio-content/adams_xmas_time.mp3')
        //fetch('https://fetch-stream-audio.anthum.com/nolimit/house-41000hz-trim.wav')
        fetch('/audio-files/house-41000hz-trim.wav')
            .then(response => this.playResponseAsStream(response, 32*1024))
            .then(() => {
                this.renderer.setEndOfStream();
                this.renderer.flush();
                console.log('all stream bytes queued for decoding');
            });
    }

    ngOnDestroy() {
        this.renderer.close();

        if (this.worker) {
            this.worker.terminate();
        }
    }

    setPlaybackPos(pos) {
        this.el.nativeElement.innerHTML = Math.round(pos);
    }

    playResponseAsStream(response, readBufferSize) {
        if (!response.ok) throw Error(response.status+' '+response.statusText)
        if (!response.body) throw Error('ReadableStream not yet supported in this browser')

        this.renderer.setPlayposCallback(this.setPlaybackPos.bind(this));

        const reader = response.body.getReader(),
              contentLength = response.headers.get('content-length'), // requires CORS access-control-expose-headers: content-length
              bytesTotal = contentLength? parseInt(contentLength, 10) : 0,
              readBuffer = new ArrayBuffer(readBufferSize),
              readBufferView = new Uint8Array(readBuffer);

        let bytesRead = 0, byte, readBufferPos = 0;

        const flushReadBuffer = () => {
          const buffer = readBuffer.slice(0, readBufferPos);
          this.worker.postMessage({decode: buffer}, [buffer]);
          readBufferPos = 0;
        }

        // Fill readBuffer and flush when readBufferSize is reached
        const read = () => {
          return reader.read().then(({value, done}) => {
            if (done) {
              flushReadBuffer();
              return;
            } else {
              bytesRead+= value.byteLength;
              //UI.downloadProgress({bytesRead, bytesTotal})
              this.downloadValue = Math.round(100 * (bytesRead / bytesTotal));

              for (byte of value) {
                readBufferView[readBufferPos++] = byte;
                if (readBufferPos === readBufferSize) {
                  flushReadBuffer();
                }
              }

              return read();
            }
          })
        }

        return read()
    }
}
