import { Component } from '@angular/core';

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


@Component({
    selector: 'dng-audio-events',
    templateUrl: './audioevents.component.html'
})
export class AudioEventsComponent {
    downloadValue = 0;
    events: Array<EventModel> = [];
    timelineLength = TIMELINE_LENGTH;

    audioCtx;
    audioSrcNodes = []; // Used to fix Safari Bug https://github.com/AnthumChris/fetch-stream-audio/issues/1


    totalTimeScheduled = 0;   // time scheduled of all AudioBuffers
    playStartedAt = 0;        // audioContext.currentTime of first scheduled play buffer
    abCreated = 0;            // AudioBuffers created
    abEnded = 0;              // AudioBuffers played/ended

    constructor(private api: ApiService) {
        this.audioCtx = new (window['AudioContext'] || window['webkitAudioContext'])();

        this.api.network.get('/audio-events').subscribe(
            (events) => {
                (events as []).forEach(event => this.events.push(new EventModel(event)));
            },
            () => MOCKEVENTS.forEach(event => this.events.push(event))
        );

        //fetch('/audio-content/adams_xmas_time.mp3')
        fetch('https://fetch-stream-audio.anthum.com/nolimit/house-41000hz-trim.wav')
            .then(response => this.playResponseAsStream(response, 16*1024))
            .then(_ => console.log('all stream bytes queued for decoding'));
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

        // TODO errors in underlying Worker must be dealt with here.
        const flushReadBuffer = () => {
          console.log('flush', bytesRead);
          const data = this.decodeBuffer(readBuffer.slice(0, readBufferPos));
          readBufferPos = 0;

          data.channelData = data.channelData.map(arrayBuffer => new Float32Array(arrayBuffer));
          console.log('for playback');
          this.schedulePlayback(data);
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

    decodeBuffer(arrayBuffer) {
        const blockSize = 4;
        const numChannels = 2;
        const sampleRate = 44100;

        const dataView = new DataView(arrayBuffer);
        const chunkSize = dataView.byteLength;

        let length = Math.floor(chunkSize / blockSize);
        let channelData = new Array(numChannels);

        for (let ch = 0; ch < numChannels; ch++) {
            channelData[ch] = new Float32Array(length);
        }

        let pos = 0;
        for (let i = 0; i < length; i++) {
            for (let ch = 0; ch < numChannels; ch++) {
                const data = dataView.getInt16(pos);
                channelData[ch][i] = data < 0 ? data / 32768 : data / 32767;
                //channelData[ch][i] = dataView.getInt16(pos) / 32768;
                pos += 2;
                //pos++;
            }
        }

        console.log('DONE Reading', length, chunkSize, pos);

        return {
            channelData: channelData.map(arr => arr.buffer),
            length,
            numChannels,
            sampleRate
        };
    }

    schedulePlayback({channelData, length, numChannels, sampleRate}) {
        console.log(length, numChannels, sampleRate);

        const audioSrc = this.audioCtx.createBufferSource();
        const audioBuffer = this.audioCtx.createBuffer(numChannels, length, sampleRate);

        const onAudioNodeEnded = () => {
            console.log('ended');
            this.audioSrcNodes.shift();
            this.abEnded++;
            //updateUI();
          }

        audioSrc.onended = onAudioNodeEnded;
        this.abCreated++;

        // ensures onended callback is fired in Safari
        if (window['webkitAudioContext']) {
            this.audioSrcNodes.push(audioSrc);
        }

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

      // initialize first play position.  initial clipping/choppiness sometimes occurs and intentional start latency needed
      // read more: https://github.com/WebAudio/web-audio-api/issues/296#issuecomment-257100626
      if (!this.playStartedAt) {
        const startDelay = audioBuffer.duration + (this.audioCtx.baseLatency || 128 / this.audioCtx.sampleRate);
        this.playStartedAt = this.audioCtx.currentTime + startDelay;
        //UI.playing();
      }

      audioSrc.buffer = audioBuffer
      audioSrc.connect(this.audioCtx.destination);
      audioSrc.start(this.playStartedAt + this.totalTimeScheduled);
      this.totalTimeScheduled += audioBuffer.duration;
      console.log(this.totalTimeScheduled);
    }
}
