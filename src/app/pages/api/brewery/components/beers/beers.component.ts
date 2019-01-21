import { Component, OnInit } from '@angular/core';

import { StateTrackerObservable, ProgressStates } from '../../../../../utils/base';
import { NetworkService, ConnectionOptions } from '../../../../../services';


const BASE_URL = 'https://api.punkapi.com/v2/beers';

@Component({
    selector: 'dng-beers',
    templateUrl: './beers.component.html',
    styleUrls: ['./beers.component.scss']
})
export class BeersComponent implements OnInit {
    list = [];
    page = 1;
    loading = false;
    scrollCb: Function;
    stateTracker = new StateTrackerObservable();
    connectionOptions = new ConnectionOptions();

    constructor(private network: NetworkService) {
        this.connectionOptions.cors = true;
        this.scrollCb = this.getData.bind(this);
        this.getData(null);
    }

    ngOnInit() {
        this.stateTracker.observable.subscribe((tracker) => {
            this.loading = (tracker.state === ProgressStates.SUBMITTED);
        });
    }

    getBeers(page: number, done: Function | null) {
        const url = `${BASE_URL}?page=${page}`;
        this.network.get(url, this.connectionOptions).subscribe(response => {
            (response as any).forEach(item => this.list.push(item));
            this.page += 1;

            if (done) {
                done();
            }
        });
    }

    getData(done: Function | null) {
        this.getBeers(this.page, done);
    }
}
