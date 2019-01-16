import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { pairwise, map } from 'rxjs/operators';

// https://blog.strongbrew.io/infinite-scroll-with-rxjs-and-angular2/

@Directive({
    selector: '[dngScroller]',
})
export class ScrollerDirective implements AfterViewInit {
    @Input() callback: Function;

    constructor(protected elementRef: ElementRef) { }

    ngAfterViewInit() {
        console.log('HEP');
        fromEvent(window/*this.elementRef.nativeElement*/, 'scroll').pipe(
            // pairwise(),
            map((e: any) => {
                console.log(e);
                console.log(e.target.scrollingElement.offsetHeight);
                console.log(e.target.scrollingElement.clientHeight);

                return {
                    sH: e.target.scrollHeight,
                    sT: e.target.scrollTop,
                    cH: e.target.clientHeight
                };
            })
        ).subscribe((data) => {
            console.log(data);
        });
    }
}
