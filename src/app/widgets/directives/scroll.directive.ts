import { Directive, Input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinct } from 'rxjs/operators';

import { AppBaseTrackerComponent } from '../../utils/base';


@Directive({
    selector: '[dngScroller]',
})
export class ScrollerDirective extends AppBaseTrackerComponent implements AfterViewInit, OnDestroy {
    @Input() callback: Function;
    @Input() threshold = 70;

    constructor(protected elementRef: ElementRef) {
        super();
        this.initStateChangesTracker();
    }

    ngAfterViewInit() {
        let prevHeight = 0;
        fromEvent(window, 'scroll').pipe(
            // Pass on the needed height values
            map((e: any) => {
                return {
                    wY: window.scrollY,
                    cH: e.target.body.clientHeight
                };
            }),

            // Proceed only when scrolling outside our viewport
            filter(current => current.wY >= current.cH - window.innerHeight),

            // Only when the user stops scrolling for 100 ms, we can continue
            debounceTime(100),

            // Filter out double values
            distinct(),

            // Make sure we are scrolling enough distance from previous value.
            // This makes sure that scrolling events are not triggered in case
            // only a small scroll advancement was made since last check.
            filter((data) => {
                const diff = data.cH - prevHeight;
                const status = diff > this.threshold;
                prevHeight = data.cH;

                return status;
            })
        )
        .subscribe(() => {
            // We are about to fetch some data -> change progress state
            this.setProcessingState();

            // Get the data and changed progress state back
            this.callback().subscribe(() => this.stateTracker.setSuccess());
        });
    }

    ngOnDestroy () {
        this.untrackStateChanges();
    }
}
