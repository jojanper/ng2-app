import { EventModel } from './event';


const DATA = {
    id: 'data',
    ts: 2000,
    value: 123,
    selectorId: 'foo'
};

describe('EventModel', () => {
    const model = new EventModel(DATA);

    it('supports getters', () => {
        expect(model.name).toEqual(DATA.id);
        expect(model.value).toEqual(DATA.value);
        expect(model.selector).toEqual(DATA.selectorId);
        expect(model.displayName.length).toBeTruthy();
    });

    it('supports timing related interfaces', () => {
        expect(model.timestamp).toEqual(DATA.ts);
        expect(model.timestampSec).toEqual('2s');

        model.timestamp = 3500;
        expect(model.timestampSec).toEqual('3.5s');
    });
});
