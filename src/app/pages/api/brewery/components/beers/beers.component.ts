import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { StateTrackerObservable, ProgressStates } from '../../../../../utils/base';
import { NetworkService, ConnectionOptions } from '../../../../../services';
import { Beer } from '../../models';
import { getBeers } from '../../store';
import * as Actions from '../../store/actions';


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

    constructor(private store: Store<any>, private network: NetworkService) {
        this.connectionOptions.cors = true;
        this.scrollCb = (): Observable<boolean> => this.getBeers(this.page);
    }

    ngOnInit() {
        // Track when data is being loaded from remote
        this.subscription = this.stateTracker.observable.subscribe((tracker) => {
            this.loading = (tracker.state === ProgressStates.SUBMITTED);
        });

        // Changes occured to beers data
        this.store.pipe(select(getBeers)).subscribe((data) => {
            this.page = data.page;
            this.list = data.beers;

            // Load initial data
            if (this.list.length === 0) {
                this.getBeers(this.page, 0).subscribe(() => {});
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    protected getBeers(page: number, timeout = 750): Observable<boolean> {
        const url = `${BASE_URL}?page=${page}`;
        return this.network.get(url, this.connectionOptions).pipe(
            delay(timeout),
            map((response) => {
                this.page += 1;
                this.store.dispatch(new Actions.SaveAction({
                    beers: response as Array<Beer>,
                    page: this.page
                }));

                return true;
            })
        );
    }
}
