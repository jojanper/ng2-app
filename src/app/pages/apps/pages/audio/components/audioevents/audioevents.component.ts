import { Component } from '@angular/core';

import { ApiService } from '../../../../../../services';


@Component({
    selector: 'dng-audio-events',
    template: '<dng-timeline [events]="events"></dng-timeline>',
})
export class AudioEventsComponent {
    events = [];

    constructor(private api: ApiService) {
        this.api.network.get('/audio-events').subscribe((events) => {
            (events as []).forEach(event => this.events.push(event));
        });
    }
}
