import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';

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


class AudioRenderBuffers {
    private duration = 0;
    private consume = false;
    private buffers: Array<any>;
    private durationThr: number;
    //private counter = 0;

    constructor(bufferDuration) {
        this.buffers = [];
        this.durationThr = bufferDuration;
    }

    addBuffer(audioBuffer) {
        /*
        this.counter++;
        if (this.counter > 30) {
            this.counter = 0;
            this.duration = 0;
        }
        */

        this.duration += audioBuffer.duration;
        this.buffers.push(audioBuffer);
        this.setConsumeStatus();
        console.log(this.duration, this.durationThr, this.consume);
    }

    getBuffer() {
        if (this.consume && this.buffers.length) {
            const buffer = this.buffers.shift();
            this.duration -= buffer.duration;
            return buffer;
         }

         return null;
    }

    private setConsumeStatus() {
        this.consume = this.duration > this.durationThr;
    }
}


@Component({
    selector: 'dng-audio-events',
    templateUrl: './audioevents.component.html'
})
export class AudioEventsComponent implements OnDestroy {
    downloadValue = 0;
    events: Array<EventModel> = [];
    timelineLength = TIMELINE_LENGTH;

    @ViewChild('elapsed') private el: ElementRef;

    audioCtx;
    audioSrcNodes = []; // Used to fix Safari Bug https://github.com/AnthumChris/fetch-stream-audio/issues/1

    playStartedAt = 0;        // audioContext.currentTime of first scheduled play buffer
    abCreated = 0;            // AudioBuffers created
    abEnded = 0;              // AudioBuffers played/ended

    worker: Worker;
    initTime = undefined;

    allDecoded = false;

    audioBuffers = new AudioRenderBuffers(0.5);

    constructor(private api: ApiService) {
        this.audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();

        this.worker = new Worker('/assets/scripts/worker.js');

        this.worker.onmessage = event => {
            if (event.data.channelData) {
              const decoded = event.data;

              // convert Transferrable ArrayBuffer to Float32Array
              decoded.channelData = decoded.channelData.map(arrayBuffer => new Float32Array(arrayBuffer));

              this.schedulePlayback(decoded);
            }
        }

        this.api.network.get('/audio-events').subscribe(
            (events) => {
                (events as []).forEach(event => this.events.push(new EventModel(event)));
            },
            () => MOCKEVENTS.forEach(event => this.events.push(event))
        );

        //fetch('/audio-content/adams_xmas_time.mp3')
        fetch('https://fetch-stream-audio.anthum.com/nolimit/house-41000hz-trim.wav')
            .then(response => this.playResponseAsStream(response, 32*1024))
            .then(() => {
                this.flush();
                this.allDecoded = true;
                console.log('all stream bytes queued for decoding');
            });
    }

    ngOnDestroy() {
        console.log('DESTROY()');
        if (this.audioCtx) {
            this.audioCtx.close();
        }

        if (this.worker) {
            this.worker.terminate();
        }
    }

    playResponseAsStream(response, readBufferSize) {
        if (!response.ok) throw Error(response.status+' '+response.statusText)
        if (!response.body) throw Error('ReadableStream not yet supported in this browser')

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
        */

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
            */
        }
        /*else {
            console.log('BUFFER UNDER-RUN');
            //this.playStartedAt = 0;
            //this.initTime = undefined;
        }
        */
    }

    scheduleAudioBuffer(audioBuffer) {
        const audioSrc = this.audioCtx.createBufferSource();

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

            if (!this.allDecoded && this.abCreated - this.abEnded === 0) {
                this.playStartedAt = 0;
                console.log('START OVER');
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
        */
    }

    flush() {
        let audioBuffer = this.audioBuffers.getBuffer();
        while (audioBuffer) {
            this.scheduleAudioBuffer(audioBuffer);
            audioBuffer = this.audioBuffers.getBuffer();
        }
    }

    togglePlayback() {
        if(this.audioCtx.state === 'running') {
            this.audioCtx.suspend().then(_ => console.log('Pause'))
          } else if(this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().then(() => console.log('Resume'))
      }
    }
}
