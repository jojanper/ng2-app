import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { EventModel } from '../../models';
import { TimelineEntryComponent } from './timeline-entry.component';


const EVENT = new EventModel({
    id: 'Seek',
    selectorId: 'Seek forward',
    ts: 1500,
    value: 0
});

const MAXDURATION = 5000;

const html = `
    <dng-timeline-entry
        [timelineLength]="timelineLength" [event]="event">
    </dng-timeline-entry>`;

@Component({
    selector: 'dng-timeline-entry-test',
    template: html
})
class TestTimelineEntryComponent {
    event = EVENT;
    timelineLength = MAXDURATION;

    constructor() { }
}

describe('TimelineEntryComponent Component', () => {
    let element: any;
    let fixture: ComponentFixture<TestTimelineEntryComponent>;

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [
            ],
            declarations: [
                TimelineEntryComponent,
                TestTimelineEntryComponent
            ],
            providers: [
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(TestTimelineEntryComponent);
            fixture.detectChanges();
            element = fixture.nativeElement.querySelectorAll('.timeline-entry')[0];
            done();
        });
    });

    function setMouseEvent(xPos) {
        element.dispatchEvent(new MouseEvent('mousedown'));

        window.dispatchEvent(new MouseEvent('mousemove', {
            clientX: xPos
        } as EventInit));

        window.dispatchEvent(new MouseEvent('mouseup', {
            clientX: xPos
        } as EventInit));
    }

    it('User moves event position in the timeline', () => {
        setMouseEvent(500);
        expect(fixture.componentInstance.event.timestamp).toBeGreaterThan(1500);
    });

    it('Minimum timeline position is selected', () => {
        setMouseEvent(0);
        expect(fixture.componentInstance.event.timestamp).toEqual(0);
    });

    it('Maximum timeline position is selected', () => {
        setMouseEvent(1000);
        expect(fixture.componentInstance.event.timestamp).toEqual(MAXDURATION);
    });
});
