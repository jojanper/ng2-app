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
    timelineLength = 5000;

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

    it('User moves event position in the timeline', done => {
        element.dispatchEvent(new MouseEvent('mousedown'));

        window.dispatchEvent(new MouseEvent('mousemove', {
            clientX: 500
        } as EventInit));

        fixture.detectChanges();

        expect(fixture.componentInstance.event.timestamp).toEqual(3284);

        done();
    });
});
