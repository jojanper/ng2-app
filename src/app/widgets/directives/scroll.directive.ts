import { Directive, Input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { tap, pairwise, map, filter, debounceTime, distinct, startWith } from 'rxjs/operators';

import { AppBaseTrackerComponent } from '../../utils/base';


const DEFAULT_SCROLL_POSITION = {
    wY: 0,
    cH: 0
}

// https://blog.strongbrew.io/infinite-scroll-with-rxjs-and-angular2/

@Directive({
    selector: '[dngScroller]',
})
export class ScrollerDirective extends AppBaseTrackerComponent implements AfterViewInit, OnDestroy {
    @Input() callback: Function;
    @Input() threshold = 50;

    constructor(protected elementRef: ElementRef) {
        super();
        this.initStateChangesTracker();
    }

    ngAfterViewInit() {
        //console.log('HEP');
        let prevHeight = 0;
        fromEvent(window/*this.elementRef.nativeElement*/, 'scroll').pipe(
            // pairwise(),
            //startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION]),
            map((e: any) => {
                //console.log(e);
                //console.log(e.target.scrollingElement.offsetHeight);
                //console.log(e.target.scrollingElement.clientHeight);
                //console.log(window.scrollY);

                //console.log(e.target);

                return {
                    //sH: e.target.scrollHeight,
                    //sT: e.target.scrollTop,
                    wY: window.scrollY,
                    cH: e.target.body.clientHeight
                };
            }),
            //startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION]),
            // create a stream with the filtered values
	        // we only need the values from when we are scrolling outside
	        // our viewport
	        filter(current => {
                //console.log(current, window.innerHeight);
                return current.wY >= current.cH - window.innerHeight
            }),
            // we are only interested in the scrollY value of these events
	        // let's create a stream with only these values
            //map(() => window.scrollY),

            // Only when the user stops scrolling for 200 ms, we can continue
	        // so let's debounce this stream for 200 ms
            debounceTime(100),

	        // filter out double values
            distinct(),
            //pairwise(),
            /*
            tap(data => {
                prev = data.cH;
                /*
                const status = data[1].cH - data[0].cH > 50;
                console.log(status, data);
                return status;
                *
            })
            */
           filter((data) => {
                const diff = data.cH - prevHeight;
                const status = diff > this.threshold;
                //console.log('fetch', data.cH, prev, diff, status);
                prevHeight = data.cH;
                return status;
           })
        )
        .subscribe(() => {
            //if (this.inProgress === false) {
                //console.log(data);

                //this.fetch = true;
                this.setProcessingState();
                //setTimeout(() => {
                    //this.callback();
                    //this.fetch = false;
                this.callback().subscribe(() => {
                    this.stateTracker.setSuccess();
                });
                //}, 2000);
            //}
        });
    }

    ngOnDestroy () {
        this.untrackStateChanges();
    }
}
