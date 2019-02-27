import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Observable, from, Subscription } from 'rxjs';

import { AlertService } from '../../../../../../services';
import { AudioRenderer, DataChunkDownloader } from '../engine';


@Component({
    selector: 'dng-media-player',
    templateUrl: './player.component.html'
})
export class MediaPlayerComponent implements OnDestroy, OnInit {
    @ViewChild('elapsed') private el: ElementRef;
    @ViewChild('state') private state: ElementRef;

    worker: Worker;
    renderer: AudioRenderer;
    dataDownloader: DataChunkDownloader;
    downloadProgress: Observable<number>;
    subscription: Subscription;

    constructor(private alert: AlertService) {
        this.renderer = new AudioRenderer(2.5);
        this.worker = new Worker('decoder-worker.js');
        this.dataDownloader = new DataChunkDownloader(this.worker);
        this.downloadProgress = this.dataDownloader.downloadObservable;
    }

    ngOnInit() {
        const url = '/audio-files/house-41000hz-trim.wav';

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
