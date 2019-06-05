import { Component, Input, ViewChild, TemplateRef } from '@angular/core';

import { EventModel } from '../../models';


@Component({
    selector: 'dng-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
    @Input() event: Array<EventModel>;
    @Input() timelineLength: number;

    @ViewChild('content', { static: true }) content: TemplateRef<any>;

    constructor() {
        this.eventInfoTemplateRef = this.eventInfoTemplateRef.bind(this);
    }

    // Reurn template ref of the event modal
    eventInfoTemplateRef() {
        return this.content;
    }
}
