import { Component, OnDestroy, Input, ContentChild, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { StateTrackerObservable, ProgressStates } from '../../../../../utils/base';


@Component({
    selector: 'dng-infinite-scroll',
    templateUrl: './infinitescroll.component.html',
    styleUrls: ['./infinitescroll.component.scss']
})
export class InfiniteScrollComponent implements OnDestroy {
    @Input() scrollCb: Function;
    @Input() list: Array<any>;

    @ContentChild('itemData') templateImpl: TemplateRef<any>

    loading = false;
    stateTracker = new StateTrackerObservable();
    private subscription: Subscription;

    constructor() {
        // Track when data is being loaded from remote
        this.subscription = this.stateTracker.observable.subscribe((tracker) => {
            this.loading = (tracker.state === ProgressStates.SUBMITTED);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
