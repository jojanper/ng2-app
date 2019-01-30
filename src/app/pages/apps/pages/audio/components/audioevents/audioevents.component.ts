import { Component } from '@angular/core';

import { ApiService } from '../../../../../../services';


class EventModel {
    data: any;

    constructor(data) {
        this.data = data;
    }

    get name() {
        return this.data.id;
    }

    get timestamp() {
        return this.data.ts;
    }

    get value() {
        return this.data.value;
    }

    get selector() {
        return this.data.selectorId;
    }

    get displayName() {
        return this.selector;
    }
}


@Component({
    selector: 'dng-audio-events',
    templateUrl: './audioevents.component.html'
})
export class AudioEventsComponent {
    events: Array<EventModel> = [
        new EventModel({
            id: 'Seek',
            selectorId: 'Seek forward',
            ts: 1500,
            value: 0
        })
    ];

    constructor(private api: ApiService) {
        this.api.network.get('/audio-events').subscribe((events) => {
            (events as []).forEach(event => this.events.push(new EventModel(event)));
        });
    }
}
