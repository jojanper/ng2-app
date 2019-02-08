import { Component, OnDestroy } from '@angular/core';

import { EventModel } from '../../models';
import { ApiService } from '../../../../../../services';
//import { sample } from 'rxjs/operators';
import { fromEvent } from 'rxjs';


function MohayonaoReader(dataView) {
    this.view = dataView;
    this.pos = 0;
  }

  MohayonaoReader.prototype.remain = function() {
    return this.view.byteLength - this.pos;
  },

  MohayonaoReader.prototype.skip = function(n) {
    this.pos += n;
  },

  MohayonaoReader.prototype.uint8 = function() {
    const data = this.view.getUint8(this.pos, true);
    this.pos += 1;
    return data;
  },

  MohayonaoReader.prototype.int16 = function() {
    const data = this.view.getInt16(this.pos, true);
    this.pos += 2;
    return data;
  },

  MohayonaoReader.prototype.uint16 = function() {
    const data = this.view.getUint16(this.pos, true);
    this.pos += 2;
    return data;
  },

  MohayonaoReader.prototype.uint32 = function() {
    const data = this.view.getUint32(this.pos, true);
    this.pos += 4;
    return data;
  },

  MohayonaoReader.prototype.string = function(n) {
    let data = "";
    for (let i = 0; i < n; i++) {
      data += String.fromCharCode(this.uint8());
    }
    return data;
  },

  MohayonaoReader.prototype.pcm8 = function() {
    const data = this.view.getUint8(this.pos) - 128;
    this.pos += 1;
    return data < 0 ? data / 128 : data / 127;
  },

  MohayonaoReader.prototype.pcm8s = function() {
    const data = this.view.getUint8(this.pos) - 127.5;
    this.pos += 1;
    return data / 127.5;
  },

  MohayonaoReader.prototype.pcm16 = function() {
    const data = this.view.getInt16(this.pos, true);
    this.pos += 2;
    return data * 0.000030518;
    //return data < 0 ? data / 32768 : data / 32767;
  },

  MohayonaoReader.prototype.pcm16s = function() {
    const data = this.view.getInt16(this.pos, true);
    this.pos += 2;
    return data / 32768;
  },

  MohayonaoReader.prototype.pcm24 = function() {
    let x0 = this.view.getUint8(this.pos + 0);
    let x1 = this.view.getUint8(this.pos + 1);
    let x2 = this.view.getUint8(this.pos + 2);
    let xx = (x0 + (x1 << 8) + (x2 << 16));
    let data = xx > 0x800000 ? xx - 0x1000000 : xx;
    this.pos += 3;
    return data < 0 ? data / 8388608 : data / 8388607;
  },

  MohayonaoReader.prototype.pcm24s = function() {
    let x0 = this.view.getUint8(this.pos + 0);
    let x1 = this.view.getUint8(this.pos + 1);
    let x2 = this.view.getUint8(this.pos + 2);
    let xx = (x0 + (x1 << 8) + (x2 << 16));
    let data = xx > 0x800000 ? xx - 0x1000000 : xx;
    this.pos += 3;
    return data / 8388608;
  },

  MohayonaoReader.prototype.pcm32 = function() {
    const data = this.view.getInt32(this.pos, true);
    this.pos += 4;
    return data < 0 ? data / 2147483648 : data / 2147483647;
  },

  MohayonaoReader.prototype.pcm32s = function() {
    const data = this.view.getInt32(this.pos, true);
    this.pos += 4;
    return data / 2147483648;
  },

  MohayonaoReader.prototype.pcm32f = function() {
    const data = this.view.getFloat32(this.pos, true);
    this.pos += 4;
    return data;
  },

  MohayonaoReader.prototype.pcm64f = function() {
    const data = this.view.getFloat64(this.pos, true);
    this.pos += 8;
    return data;
  }

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
export class AudioEventsComponent implements OnDestroy {
    downloadValue = 0;
    events: Array<EventModel> = [];
    timelineLength = TIMELINE_LENGTH;

    audioCtx;
    audioSrcNodes = []; // Used to fix Safari Bug https://github.com/AnthumChris/fetch-stream-audio/issues/1


    totalTimeScheduled = 0;   // time scheduled of all AudioBuffers
    playStartedAt = 0;        // audioContext.currentTime of first scheduled play buffer
    abCreated = 0;            // AudioBuffers created
    abEnded = 0;              // AudioBuffers played/ended

    initTime = undefined;
    playPos = 0;

    // https://stackoverflow.com/questions/31644060/how-can-i-get-an-audiobuffersourcenodes-current-time
    elapsedTime = 0;

    readerMeta;
    worker;

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
            .then(response => this.playResponseAsStream(response, 64*1024))
            .then(_ => console.log('all stream bytes queued for decoding'));

        setInterval(() => {
            console.log('SET');
            this.setElapsedTime();
        }, 1000);

        /*
        fromEvent(window, 'playing').subscribe((event) => {
            console.log(event);
        });
        */
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

        // TODO errors in underlying Worker must be dealt with here.
        const flushReadBuffer = () => {
          //console.log('flush', bytesRead);
          const buffer = readBuffer.slice(0, readBufferPos);

          //console.log(this.worker);
          this.worker.postMessage({decode: buffer}, [buffer]);

          /*
          const data = this.decodeBuffer(buffer);
          data.channelData = data.channelData.map(arrayBuffer => new Float32Array(arrayBuffer));
          */

          readBufferPos = 0;

          //this.schedulePlayback(data);
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

    setElapsedTime() {
        const pos = this.audioCtx.currentTime - this.initTime;
        //console.log(pos);
        this.elapsedTime = Math.round(pos);
    }

    schedulePlayback({channelData, length, numChannels, sampleRate}) {
        //console.log(length, numChannels, sampleRate);
        //console.log(this.audioCtx.currentTime);

        const audioSrc = this.audioCtx.createBufferSource();
        const audioBuffer = this.audioCtx.createBuffer(numChannels, length, sampleRate);

        const onAudioNodeEnded = () => {
            console.log('ended');
            this.audioSrcNodes.shift();
            this.abEnded++;
            //updateUI();

            this.playPos += audioBuffer.duration;
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
        //const startDelay = audioBuffer.duration + (128 / this.audioCtx.sampleRate);
        this.playStartedAt = this.audioCtx.currentTime + startDelay;
        //UI.playing();
        console.log(this.playStartedAt, this.audioCtx.baseLatency, startDelay);
      }

      audioSrc.buffer = audioBuffer
      audioSrc.connect(this.audioCtx.destination);
      audioSrc.start(this.playStartedAt /* + this.totalTimeScheduled*/);
      this.playStartedAt += audioBuffer.duration;
      this.totalTimeScheduled += audioBuffer.duration;
      //console.log(this.totalTimeScheduled);

      if (this.initTime === undefined) {
            this.initTime = this.audioCtx.currentTime;
      }
    }

    togglePlayback() {
        if(this.audioCtx.state === 'running') {
            this.audioCtx.suspend().then(_ => console.log('Pause'))
          } else if(this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().then(() => console.log('Resume'))
      }
    }

    decodeBuffer(arrayBuffer) {
        const dataView = new DataView(arrayBuffer);

        const reader = new MohayonaoReader(dataView);
        if (!this.readerMeta) {
            this.init(reader);
        }

        const blockSize = this.readerMeta.blockSize;
        const numChannels = this.readerMeta.numberOfChannels;
        const sampleRate = this.readerMeta.sampleRate;

        //console.log(blockSize, numChannels, sampleRate);

        const chunkSize = reader.remain();

        let length = Math.floor(chunkSize / blockSize);
        let channelData = new Array(numChannels);

        for (let ch = 0; ch < numChannels; ch++) {
            channelData[ch] = new Float32Array(length);
        }

        const read = reader[this.readerMeta.readerMethodName].bind(reader);

        //let pos = 0;
        for (let i = 0; i < length; i++) {
            for (let ch = 0; ch < numChannels; ch++) {
                //const data = dataView.getInt16(pos);
                //channelData[ch][i] = data < 0 ? data / 32768 : data / 32767;
                //channelData[ch][i] = dataView.getInt16(pos) / 32768;
                //pos += 2;
                //pos++;

                channelData[ch][i] = read();
            }
        }

        //console.log('DONE Reading', length, chunkSize, pos);

        return {
            channelData: channelData.map(arr => arr.buffer),
            length,
            numChannels,
            sampleRate
        };
    }

    init(reader) {
        if (reader.string(4) !== "RIFF") {
          throw new TypeError("Invalid WAV file");
        }

        reader.uint32(); // skip file length

        if (reader.string(4) !== "WAVE") {
          throw new TypeError("Invalid WAV file");
        }

        let dataFound = false, chunkType, chunkSize;

        do {
          chunkType = reader.string(4);
          chunkSize = reader.uint32();

          switch (chunkType) {
          case "fmt ":
            this.readerMeta = this.decodeMetaInfo(reader, chunkSize);
            if (this.readerMeta instanceof Error) {
              throw this.readerMeta;
            }
            break;
          case "data":
            dataFound = true;
            break;
          default:
            reader.skip(chunkSize);
            break;
          }
        } while (!dataFound);

    }

    decodeMetaInfo(reader, chunkSize) {
        const formats = {
          0x0001: "lpcm",
          0x0003: "lpcm"
        };

        const formatId = reader.uint16();

        if (!formats.hasOwnProperty(formatId)) {
          return new TypeError("Unsupported format in WAV file: 0x" + formatId.toString(16));
        }

        const meta = {
          formatId,
          floatingPoint: formatId === 0x0003,
          numberOfChannels: reader.uint16(),
          sampleRate: reader.uint32(),
          byteRate: reader.uint32(),
          blockSize: reader.uint16(),
          bitDepth: reader.uint16(),
          readerMethodName: null
        };
        reader.skip(chunkSize - 16);

        const decoderOption = meta.floatingPoint ? "f" : "";
        meta.readerMethodName = "pcm" + meta.bitDepth + decoderOption;

        if (!reader[meta.readerMethodName]) {
          return new TypeError("Not supported bit depth: " + meta.bitDepth);
        }
        return meta;
      }
}
