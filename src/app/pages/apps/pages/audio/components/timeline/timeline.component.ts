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
        this.getTemplateRef = this.getTemplateRef.bind(this);
    }

    ngOnInit() {
        console.log(this.content);
    }

    getTemplateRef() {
        console.log(this.content);
        return this.content;
    }
}
