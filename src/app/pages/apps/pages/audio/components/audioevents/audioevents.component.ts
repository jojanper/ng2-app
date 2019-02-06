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

    constructor(private api: ApiService) {
        this.api.network.get('/audio-events').subscribe(
            (events) => {
                (events as []).forEach(event => this.events.push(new EventModel(event)));
            },
            () => MOCKEVENTS.forEach(event => this.events.push(event))
        );

        fetch('/audio-content/adams_xmas_time.mp3')
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
        function flushReadBuffer() {
          console.log('flush', bytesRead);
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
