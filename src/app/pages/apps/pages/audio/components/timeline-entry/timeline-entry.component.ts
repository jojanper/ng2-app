import { fromEvent } from 'rxjs';
import { distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EventModel } from '../../models';


@Component({
    selector: 'dng-timeline-entry',
    templateUrl: './timeline-entry.component.html',
    styleUrls: ['./timeline-entry.component.scss']
})
export class TimelineEntryComponent implements AfterViewInit, OnDestroy {
    @Input() event: EventModel;
    @Input() timelineLength: number;
    @Input() eventTemplateRef: Function;

    mousedown = false;

    private destroy = false;
    private timelineWidth = 0;
    @ViewChild('timeline') private timeline: ElementRef;
    @ViewChild('timelineparent') private timelineparent: ElementRef;

    protected eventPosition = 0;

    constructor(private modal: NgbModal) { }

    ngAfterViewInit() {
        this.timelineWidth = this.parentOffsetWidth - this.timeline.nativeElement.offsetWidth;

        this.eventPosition = this.event.timestamp / this.timelineLength;
        const newMargLeft = this.eventPosition * this.timelineWidth;
        this.timeline.nativeElement.style.marginLeft = newMargLeft + 'px';

        // Track mouse down events
        fromEvent(this.timeline.nativeElement, 'mousedown').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe(() => this.mouseDown());

        // Track mouse up events
        fromEvent(window, 'mouseup').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe((event) => this.mouseUp(event));
    }

    ngOnDestroy() {
        this.destroy = true;
    }

    // User clicked mouse down, start tracking mouse movement along the timeline
    mouseDown() {
        this.mousedown = true;

        fromEvent(window, 'mousemove').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.mousedown === true)
        ).subscribe((event) => this.moveTimeline(event));
    }

    // Finalize event position in the timeline on mouse up event
    mouseUp(event) {
        if (this.mousedown) {
            this.moveTimeline(event);
        }

        this.mousedown = false;
    }

    // Moves event as user drags the element along the timeline
    moveTimeline(event) {
        const newMargLeft = event.clientX - this.parentPos;
        let eventPos = newMargLeft;

        this.timeline.nativeElement.style.marginLeft = newMargLeft + 'px';

        if (newMargLeft < 0) {
            eventPos = 0;
            this.timeline.nativeElement.style.marginLeft = '0px';
        }

        if (newMargLeft > this.timelineWidth) {
            eventPos = this.timelineWidth;
            this.timeline.nativeElement.style.marginLeft = this.timelineWidth + 'px';
        }

        this.eventPosition = eventPos / this.timelineWidth;
        this.event.timestamp = this.timelineLength * this.eventPosition;
    }

    // Show event info as modal
    showEventInfo() {
        this.modal.open(this.eventTemplateRef(), {size: 'sm'}).result.then(() => { }, () => { });
    }

    private get parentOffsetWidth() {
        return this.timelineparent.nativeElement.offsetWidth;
    }

    // Return parent element's left position relative to top-left of viewport
    private get parentPos() {
        return this.timelineparent.nativeElement.getBoundingClientRect().left;
    }
}
