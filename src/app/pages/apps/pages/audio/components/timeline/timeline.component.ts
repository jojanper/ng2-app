import { Component, Input, ViewChild, TemplateRef } from '@angular/core';


@Component({
    selector: 'dng-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
    @Input() event: any;

    @ViewChild('content') content: TemplateRef<any>;

    constructor() {
        this.eventTemplateRef = this.eventTemplateRef.bind(this);
    }

    eventTemplateRef() {
        return this.content;
    }
}
