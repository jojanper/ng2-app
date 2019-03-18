import { Component, OnDestroy, Input, ContentChild, TemplateRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { StateTrackerObservable, ProgressStates } from '../../utils/base';


export type InfiniteScrollFn = () => Observable<boolean>;

/**
 * Infinite component that wraps needed logic for fetching new data
 * when user scrolls to the end of the current data view. Typical usage
 * is as follows:
 *
 * <dng-infinite-scroll [list]="list" [scrollCb]="scrollCb">
     <ng-template #itemData let-item>
        <template-data-using-item>
     </ng-template>
   </dng-infinite-scroll>
 */
@Component({
    selector: 'dng-infinite-scroll',
    templateUrl: './infinitescroll.component.html',
    styleUrls: ['./infinitescroll.component.scss']
})
export class InfiniteScrollComponent implements OnDestroy {
    @Input() scrollCb: InfiniteScrollFn;
    @Input() list: Array<any>;
    @Input() loadText = 'Loading...';

    @ContentChild('itemData') templateImpl: TemplateRef<any>;

    loading = false;
    stateTracker = new StateTrackerObservable();
    private subscription: Subscription;

    constructor() {
        // Track when data is being loaded from remote source
        this.subscription = this.stateTracker.observable.subscribe((tracker) => {
            this.loading = (tracker.state === ProgressStates.SUBMITTED);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
