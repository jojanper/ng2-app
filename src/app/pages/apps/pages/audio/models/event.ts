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
