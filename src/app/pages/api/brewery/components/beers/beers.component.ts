import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { StateTrackerObservable, ProgressStates } from '../../../../../utils/base';
import { NetworkService, ConnectionOptions, BackendResponse } from '../../../../../services';


const BASE_URL = 'https://api.punkapi.com/v2/beers';

@Component({
    selector: 'dng-beers',
    templateUrl: './beers.component.html',
    styleUrls: ['./beers.component.scss']
})
export class BeersComponent implements OnInit, OnDestroy {
    list = [];
    page = 1;
    loading = false;
    scrollCb: Function;
    stateTracker = new StateTrackerObservable();
    protected connectionOptions = new ConnectionOptions();
    private subscription: Subscription;

    constructor(private network: NetworkService) {
        this.connectionOptions.cors = true;
        this.scrollCb = this.getData.bind(this);
        this.getData().subscribe(() => {});
    }

    ngOnInit() {
        this.subscription = this.stateTracker.observable.subscribe((tracker) => {
            this.loading = (tracker.state === ProgressStates.SUBMITTED);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getData(): Observable<BackendResponse> {
        return this.getBeers(this.page);
    }

    protected getBeers(page: number): Observable<BackendResponse> {
        const url = `${BASE_URL}?page=${page}`;
        return this.network.get(url, this.connectionOptions).pipe(
            tap((response) => {
                this.page += 1;
                (response as any).forEach(item => this.list.push(item));
        }));
    }
}
