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
    private initTime = 0;
    private playStartedAt = 0;
    private eos = false;
    private playPosCb: Function;

    constructor(bufferDuration) {
        this.buffers = new AudioRenderBuffers(bufferDuration);
        this.audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();
        this.playPosCb = null;
    }

    setEndOfStream() {
        this.eos = true;
        this.buffers.setEndOfStream();
    }

    setPlayposCallback(cb) {
        this.playPosCb = cb;
    }

    schedulePlayback({channelData, length, numChannels, sampleRate}) {
        const audioBuffer = this.audioCtx.createBuffer(numChannels, length, sampleRate);

        for (let c=0; c < numChannels; c++) {
            if (audioBuffer.copyToChannel) {
                audioBuffer.copyToChannel(channelData[c], c)
            } else {
                let toChannel = audioBuffer.getChannelData(c);
                for (let i=0; i < channelData[c].byteLength; i++) {
                    toChannel[i] = channelData[c][i];
                }
            }
        }

        this.buffers.addBuffer(audioBuffer);
        this.flush();
    }

    private scheduleAudioBuffer(audioBuffer) {
        const audioSrc = this.audioCtx.createBufferSource();

        const onAudioNodeEnded = () => {
            this.audioSrcNodes.shift();
            this.nodesEnded++;

            const pos = this.playPos + audioBuffer.duration;
            this.playPos = pos;
            //this.el.nativeElement.innerHTML = Math.round(pos);
            if (this.playPosCb) {
                this.playPosCb(Math.round(pos));
            }

            console.log('ended', this.audioCtx.currentTime,
                this.nodesCreated - this.nodesEnded, pos);

            if (!this.eos && this.nodesCreated - this.nodesEnded === 0 && this.buffers.buffering) {
                this.playStartedAt = 0;
                console.log('START OVER');
                //this.playPos = pos;
            }
        }

        audioSrc.onended = onAudioNodeEnded;
        this.nodesCreated++;

        // ensures onended callback is fired in Safari
        if (window['webkitAudioContext']) {
            this.audioSrcNodes.push(audioSrc);
        }

        // Initialize first play position
        if (!this.playStartedAt) {
            const startDelay = audioBuffer.duration + (this.audioCtx.baseLatency || 128 / this.audioCtx.sampleRate);
            this.initTime = this.audioCtx.currentTime;
            this.playStartedAt = this.initTime + startDelay;
        }

        audioSrc.buffer = audioBuffer;
        audioSrc.connect(this.audioCtx.destination);
        audioSrc.start(this.playStartedAt);
        this.playStartedAt += audioBuffer.duration;
    }

    flush() {
        let audioBuffer = this.buffers.getBuffer();
        while (audioBuffer) {
            this.scheduleAudioBuffer(audioBuffer);
            audioBuffer = this.buffers.getBuffer();
        }
    }

    togglePlayback() {
        if(this.audioCtx.state === 'running') {
            this.audioCtx.suspend().then(_ => console.log('Pause'))
          } else if(this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().then(() => console.log('Resume'))
      }
    }

    close() {
        if (this.audioCtx) {
            this.audioCtx.close();
        }
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

    /*
    audioCtx;
    audioSrcNodes = []; // Used to fix Safari Bug https://github.com/AnthumChris/fetch-stream-audio/issues/1

    playStartedAt = 0;        // audioContext.currentTime of first scheduled play buffer
    abCreated = 0;            // AudioBuffers created
    abEnded = 0;              // AudioBuffers played/ended

    initTime = undefined;

    allDecoded = false;

    audioBuffers = new AudioRenderBuffers(2.5);

    playPos = 0;
    */

    worker: Worker;
    renderer = new AudioRenderer(2.5);

    constructor(private api: ApiService) {
        //this.audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();

        this.worker = new Worker('/assets/scripts/worker.js');

        this.worker.onmessage = event => {
            if (event.data.channelData) {
              const decoded = event.data;

              // convert Transferrable ArrayBuffer to Float32Array
              decoded.channelData = decoded.channelData.map(arrayBuffer => new Float32Array(arrayBuffer));

              //this.schedulePlayback(decoded);
              this.renderer.schedulePlayback(decoded)
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
                //this.audioBuffers.setEndOfStream();
                //this.flush();
                //this.allDecoded = true;
                console.log('all stream bytes queued for decoding');
            });
    }

    ngOnDestroy() {
        console.log('DESTROY()');
        /*
        if (this.audioCtx) {
            this.audioCtx.close();
        }
        */
        this.renderer.close();

        if (this.worker) {
            this.worker.terminate();
        }
    }

    setPlaybackPos(pos) {
        this.el.nativeElement.innerHTML = pos;
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

    /*
    schedulePlayback({channelData, length, numChannels, sampleRate}) {
        //const audioSrc = this.audioCtx.createBufferSource();
        const audioBuffer = this.audioCtx.createBuffer(numChannels, length, sampleRate);

        /*
        const onAudioNodeEnded = () => {
            this.audioSrcNodes.shift();
            this.abEnded++;

            if (this.abEnded === this.abCreated) {
                console.log('ALL PROCESSED')
            }

            const pos = this.audioCtx.currentTime - this.initTime;
            this.el.nativeElement.innerHTML = Math.round(pos);

            console.log('ended', this.audioCtx.currentTime,
                this.abCreated - this.abEnded, pos);
        }

        audioSrc.onended = onAudioNodeEnded;
        this.abCreated++;

        // ensures onended callback is fired in Safari
        if (window['webkitAudioContext']) {
            this.audioSrcNodes.push(audioSrc);
        }
        *

      // Use performant copyToChannel() if browser supports it
        for (let c=0; c < numChannels; c++) {
            if (audioBuffer.copyToChannel) {
                audioBuffer.copyToChannel(channelData[c], c)
            } else {
                let toChannel = audioBuffer.getChannelData(c);
                for (let i=0; i < channelData[c].byteLength; i++) {
                    toChannel[i] = channelData[c][i];
                }
            }
        }

        this.audioBuffers.addBuffer(audioBuffer);

        this.flush();

        /*
        const consumeBuffer = this.audioBuffers.getBuffer();
        if (consumeBuffer) {
            this.scheduleAudioBuffer(consumeBuffer);
            /*
            // initialize first play position.  initial clipping/choppiness sometimes occurs and intentional start latency needed
            // read more: https://github.com/WebAudio/web-audio-api/issues/296#issuecomment-257100626
            if (!this.playStartedAt) {
                const startDelay = consumeBuffer.duration + (this.audioCtx.baseLatency || 128 / this.audioCtx.sampleRate);
                this.playStartedAt = this.audioCtx.currentTime + startDelay;
            }

            audioSrc.buffer = consumeBuffer;
            audioSrc.connect(this.audioCtx.destination);
            audioSrc.start(this.playStartedAt);
            this.playStartedAt += consumeBuffer.duration;

            if (this.initTime === undefined) {
                this.initTime = this.audioCtx.currentTime;
                console.log('Init time', this.initTime);
            }
            *
        }
        /*else {
            console.log('BUFFER UNDER-RUN');
            //this.playStartedAt = 0;
            //this.initTime = undefined;
        }
        *
    }

    scheduleAudioBuffer(audioBuffer) {
        const audioSrc = this.audioCtx.createBufferSource();

        const onAudioNodeEnded = () => {
            this.audioSrcNodes.shift();
            this.abEnded++;

            if (this.abEnded === this.abCreated) {
                console.log('ALL PROCESSED')
            }

            //const pos = this.playPos + this.audioCtx.currentTime - this.initTime;
            const pos = this.playPos + audioBuffer.duration;
            this.playPos = pos;
            this.el.nativeElement.innerHTML = Math.round(pos);

            console.log('ended', this.audioCtx.currentTime,
                this.abCreated - this.abEnded, pos);

            if (!this.allDecoded && this.abCreated - this.abEnded === 0 && this.audioBuffers.buffering) {
                this.playStartedAt = 0;
                console.log('START OVER');
                //this.playPos = pos;
            }
        }

        audioSrc.onended = onAudioNodeEnded;
        this.abCreated++;

        // ensures onended callback is fired in Safari
        if (window['webkitAudioContext']) {
            this.audioSrcNodes.push(audioSrc);
        }

        // initialize first play position.  initial clipping/choppiness sometimes occurs and intentional start latency needed
            // read more: https://github.com/WebAudio/web-audio-api/issues/296#issuecomment-257100626
        if (!this.playStartedAt) {
            const startDelay = audioBuffer.duration + (this.audioCtx.baseLatency || 128 / this.audioCtx.sampleRate);
            this.initTime = this.audioCtx.currentTime;
            this.playStartedAt = this.initTime + startDelay;
        }

        audioSrc.buffer = audioBuffer;
        audioSrc.connect(this.audioCtx.destination);
        audioSrc.start(this.playStartedAt);
        this.playStartedAt += audioBuffer.duration;

        /*
        if (this.initTime === undefined) {
            this.initTime = this.audioCtx.currentTime;
            console.log('Init time', this.initTime);
        }
        *
    }

    flush() {
        let audioBuffer = this.audioBuffers.getBuffer();
        while (audioBuffer) {
            this.scheduleAudioBuffer(audioBuffer);
            audioBuffer = this.audioBuffers.getBuffer();
        }
    }
    */
}
