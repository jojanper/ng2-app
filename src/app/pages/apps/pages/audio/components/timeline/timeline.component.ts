import { Component, Input } from '@angular/core';


@Component({
    selector: 'dng-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
    @Input() events: Array<any>;
}
