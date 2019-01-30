import { fromEvent } from 'rxjs';
import { distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'dng-timeline-entry',
    templateUrl: './timeline-entry.component.html',
    styleUrls: ['./timeline-entry.component.scss']
})
export class TimelineEntryComponent implements AfterViewInit, OnDestroy {
    @Input() event: any;
    @Input() eventTemplateRef: Function;

    private destroy = false;
    private mousedown = false;
    private timelineWidth = 0;
    @ViewChild('timeline') private timeline: ElementRef;
    @ViewChild('timelineparent') private timelineparent: ElementRef;

    protected eventPosition = 0;

    constructor(private modal: NgbModal) { }

    ngAfterViewInit() {
        this.timelineWidth = this.parentOffsetWidth - this.timeline.nativeElement.offsetWidth;

        fromEvent(this.timeline.nativeElement, 'mousedown').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe(() => this.mouseDown());

        fromEvent(window, 'mouseup').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.destroy === false)
        ).subscribe((event) => this.mouseUp(event));
    }

    ngOnDestroy() {
        this.destroy = true;
    }

    mouseDown() {
        this.mousedown = true;

        fromEvent(window, 'mousemove').pipe(
            distinctUntilChanged(),
            takeWhile(() => this.mousedown === true)
        ).subscribe((event) => this.mouseMove(event));
    }

    mouseMove(event) {
        this.moveTimeline(event);
    }

    mouseUp(event) {
        if (this.mousedown) {
            this.moveTimeline(event);
        }

        this.mousedown = false;
    }

    // Moves event as user drags
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
    }

    showEventInfo() {
        this.modal.open(this.eventTemplateRef(), {size: 'sm'}).result.then(() => { }, () => { });
    }

    get position() {
        return this.timeline.nativeElement ? this.timeline.nativeElement.style.marginLeft : 0;
    }

    private get parentOffsetWidth() {
        return this.timelineparent.nativeElement.offsetWidth;
    }

    private get parentPos() {
        // Return elements left position relative to top-left of viewport
        return this.timelineparent.nativeElement.getBoundingClientRect().left;
    }
}
