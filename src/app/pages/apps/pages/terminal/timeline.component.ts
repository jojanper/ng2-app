import { Component, AfterViewInit, OnInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, takeWhile } from 'rxjs/operators';

import { NetworkService, ConnectionOptions } from '../../../../services';


// Returns elements left position relative to top-left of viewport
function getPosition(el) {
    return el.getBoundingClientRect().left;
}

@Component({
    selector: 'dng-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent /*implements OnInit, OnDestroy*/ {
    //private destroy = false;

    //protected mousedown = false;
    //protected timelineWidth = 0;
    //@ViewChild('timeline') private timeline: ElementRef;
    @ViewChild('timelineparent') timelineparent: ElementRef;

    //protected connectionOptions = new ConnectionOptions();

    constructor(/*private network: NetworkService*/) {
        /*
        this.connectionOptions.cors = true;

        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        */

        this.getOffsetWidth = this.getOffsetWidth.bind(this);
        this.parentPos = this.parentPos.bind(this);
    }

    getOffsetWidth() {
        return this.timelineparent.nativeElement.offsetWidth;
    }

    parentPos() {
        return getPosition(this.timelineparent.nativeElement);
    }

    /*
    ngOnInit() {

        fromEvent(this.timeline.nativeElement, 'mousedown').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe(() => this.mouseDown());

        fromEvent(window, 'mouseup').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe((event) => this.mouseUp(event));

        /*
        console.log('HEP');
        this.network.get('http://localhost:3000', this.connectionOptions).subscribe((response) => {
            console.log(response);
        });
        *
    }

    ngOnDestroy() {
        this.destroy = true;
    }

    mouseDown() {
        //console.log(event);
        console.log('MOUSE DOWN');
        this.mousedown = true;
        this.timelineWidth = this.timelineparent.nativeElement.offsetWidth - this.timeline.nativeElement.offsetWidth;

        console.log(this.timeline.nativeElement);

        fromEvent(window, 'mousemove').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.mousedown === true)
        ).subscribe((event) => this.mouseMove(event));

        //console.log(this);
        //this['t'].open();

        //window.addEventListener('mousemove', this.mouseMove, true);
    }

    mouseMove(event) {
        this.moveTimeline(event);
    }

    mouseUp(event) {
        console.log('MOUSE UP');
        if (this.mousedown) {
            this.moveTimeline(event);
            //this['t'].close();
            //window.removeEventListener('mousemove', this.mouseMove, true);
        }

        this.mousedown = false;
    }

    // Moves playhead as user drags
    moveTimeline(event) {
        var newMargLeft = event.clientX - getPosition(this.timelineparent.nativeElement);

        //console.log(newMargLeft, this.timelineWidth);

        //if (newMargLeft >= 0 && newMargLeft <= this.timelineWidth) {
            this.timeline.nativeElement.style.marginLeft = newMargLeft + "px";
        //}

        if (newMargLeft < 0) {
            this.timeline.nativeElement.style.marginLeft = "0px";
        }

        if (newMargLeft > this.timelineWidth) {
            this.timeline.nativeElement.style.marginLeft = this.timelineWidth + "px";
        }
    }

    get position() {
        //console.log(this.timeline.nativeElement);
        return this.timeline.nativeElement ? this.timeline.nativeElement.style.marginLeft : 0;
    }
    */
}

@Component({
    selector: 'dng-timeline-entry',
    templateUrl: './timeline-entry.component.html',
    styleUrls: ['./timeline-entry.component.scss']
})
export class TimelineEntryComponent implements AfterViewInit, OnDestroy {
    private destroy = false;

    @Input() parentOffsetWidth: Function;
    @Input() parentPos: Function;

    protected mousedown = false;
    protected timelineWidth = 0;
    @ViewChild('timeline') private timeline: ElementRef;

    protected connectionOptions = new ConnectionOptions();

    constructor() {
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    ngAfterViewInit() {

        fromEvent(this.timeline.nativeElement, 'mousedown').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe(() => this.mouseDown());

        fromEvent(window, 'mouseup').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe((event) => this.mouseUp(event));

        /*
        console.log('HEP');
        this.network.get('http://localhost:3000', this.connectionOptions).subscribe((response) => {
            console.log(response);
        });
        */
    }

    ngOnDestroy() {
        this.destroy = true;
    }

    mouseDown() {
        //console.log(event);
        console.log('MOUSE DOWN');
        this.mousedown = true;
        this.timelineWidth = this.parentOffsetWidth() - this.timeline.nativeElement.offsetWidth;

        console.log(this.timeline.nativeElement);

        fromEvent(window, 'mousemove').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.mousedown === true)
        ).subscribe((event) => this.mouseMove(event));

        //console.log(this);
        //this['t'].open();

        //window.addEventListener('mousemove', this.mouseMove, true);
    }

    mouseMove(event) {
        this.moveTimeline(event);
    }

    mouseUp(event) {
        console.log('MOUSE UP');
        if (this.mousedown) {
            this.moveTimeline(event);
            //this['t'].close();
            //window.removeEventListener('mousemove', this.mouseMove, true);
        }

        this.mousedown = false;
    }

    // Moves playhead as user drags
    moveTimeline(event) {
        var newMargLeft = event.clientX - this.parentPos();
        //getPosition(this.timelineparent.nativeElement);

        //console.log(newMargLeft, this.timelineWidth);

        //if (newMargLeft >= 0 && newMargLeft <= this.timelineWidth) {
            this.timeline.nativeElement.style.marginLeft = newMargLeft + "px";
        //}

        if (newMargLeft < 0) {
            this.timeline.nativeElement.style.marginLeft = "0px";
        }

        if (newMargLeft > this.timelineWidth) {
            this.timeline.nativeElement.style.marginLeft = this.timelineWidth + "px";
        }
    }

    get position() {
        //console.log(this.timeline.nativeElement);
        return this.timeline.nativeElement ? this.timeline.nativeElement.style.marginLeft : 0;
    }
}
