import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { pairwise, map } from 'rxjs/operators';


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
