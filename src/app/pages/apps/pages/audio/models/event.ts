export class EventModel {
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

    get timestampSec() {
        const ts = this.data.ts / 1000;
        return `${ts}s`;
    }

    set timestamp(ts) {
        this.data.ts = Math.round(ts);
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
