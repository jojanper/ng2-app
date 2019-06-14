import { Component, OnDestroy, ViewChild, ElementRef, OnInit, isDevMode } from '@angular/core';
import { Observable, from, Subscription } from 'rxjs';

import { AlertService } from '../../../../../../services';
import { AudioRenderer, DataChunkDownloader } from '../engine';


@Component({
    selector: 'dng-media-player',
    templateUrl: './player.component.html'
})
export class MediaPlayerComponent implements OnDestroy, OnInit {
    @ViewChild('elapsed', { static: true }) private el: ElementRef;
    @ViewChild('state', { static: true }) private state: ElementRef;

    worker: Worker;
    renderer: AudioRenderer;
    dataDownloader: DataChunkDownloader;
    downloadProgress: Observable<number>;
    subscription: Subscription;

    constructor(private alert: AlertService) {
        const script = isDevMode ? 'decoder-worker.js' : '/frontend/decoder-worker.js';
        this.worker = new Worker(script);

        this.renderer = new AudioRenderer(2.5);
        this.dataDownloader = new DataChunkDownloader(this.worker);
        this.downloadProgress = this.dataDownloader.downloadObservable;
    }

    ngOnInit() {
        const url = '/audio-files/house-41000hz-trim.wav';
        // const url = '/decode-audio';

        this.dataDownloader.attachListener(data => this.renderer.scheduleRender(data));

        const observable = from(this.dataDownloader.start(url, () => {
            this.renderer.setEndOfStream();
        }));

        this.subscription = observable.subscribe(
            () => {},
            err => this.alert.error(err)
        );

        this.renderer.posObservable.subscribe((pos) => {
            this.el.nativeElement.innerHTML = Math.round(pos);
        });

        this.renderer.stateObservable.subscribe((data) => {
            this.state.nativeElement.innerHTML = data.state;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();

        this.renderer.close();

        if (this.worker) {
            this.worker.terminate();
        }
    }
}
