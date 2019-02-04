export declare interface EventData {
    id: any;
    ts: number;
    value: any;
    selectorId: any;
}

export class EventModel {
    data: EventData;

    constructor(data: EventData) {
        this.data = data;
    }

    get name(): string {
        return this.data.id;
    }

    get timestamp(): number {
        return this.data.ts;
    }

    get timestampSec(): string {
        const ts = this.data.ts / 1000;
        return `${ts}s`;
    }

    set timestamp(ts: number) {
        this.data.ts = Math.round(ts);
    }

    get value(): any {
        return this.data.value;
    }

    get selector(): any {
        return this.data.selectorId;
    }

    get displayName() {
        return this.selector;
    }
}
