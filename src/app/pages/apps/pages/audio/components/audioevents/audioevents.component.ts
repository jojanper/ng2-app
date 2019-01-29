import { Component } from '@angular/core';

import { ApiService } from '../../../../../../services';


@Component({
    selector: 'dng-audio-events',
    templateUrl: './audioevents.component.html'
})
export class AudioEventsComponent {
    events = [
        {
            id: 'Seek',
            selectorId: 'Seek forward',
            ts: 1500,
            value: 0
        }
    ];

    constructor(private api: ApiService) {
        this.api.network.get('/audio-events').subscribe((events) => {
            (events as []).forEach(event => this.events.push(event));
        });
    }
}
