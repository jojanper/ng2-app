import { forkJoin } from 'rxjs/observable/forkJoin';

import { AppObservableArray, AppObservableArrayModes,
    AppObservableObject, AppObservablePersistentObject } from './base.observable';


class TestObservable extends AppObservableArray<string> {}

describe('TestObservable', () => {

    it('default mode is selected by constructor', () => {
        const testObj = new TestObservable('foo');

        let state = null;
        testObj.observable.subscribe(_state => state = _state);

        // Adding new item should succeed
        testObj.addSubject('bar');
        expect(state).toEqual(['bar']);
    });

    it('supports persistent observable', () => {
        const testObj = new TestObservable(AppObservableArrayModes.PERSISTENT);

        // Adding 2 items should be available for late subscription
        testObj.addSubject('bar');
        testObj.addSubject('foo');

        expect(testObj.arrayLength).toEqual(2);

        // Late subscription
        let state = null;
        testObj.observable.subscribe(_state => state = _state);

        // Items are available
        expect(state).toEqual(['bar', 'foo']);

        // Remove first item
        testObj.removeSubject((item) => {
            return (item === 'bar') ? true : false;
        });
        expect(state).toEqual(['foo']);

        // Remove all items
        testObj.removeAllSubjects();
        expect(state).toEqual([]);

        // Append new item and publish
        state = null;
        testObj.push(['oof']);
        testObj.next();
        expect(state).toEqual(['oof']);
    });

    it('supports observable with initial value', () => {
        const testObj = new TestObservable(AppObservableArrayModes.EMPTY);

        let state = null;
        testObj.observable.subscribe(_state => state = _state);

        // Initial value is as expected
        expect(state).toEqual([]);

        // Adding new value succeeds
        testObj.addSubjects(['foo']);
        expect(state).toEqual(['foo']);
    });

    it('sequence is completed', () => {
        let state = null;

        const testObj = new TestObservable(AppObservableArrayModes.EMPTY);
        forkJoin(testObj.observable).subscribe(results => state = results[0]);

        // Item is added to sequence, next and complete is called which will
        // fire the above forkJoin
        testObj.push(['foobar']);
        testObj.next();
        testObj.complete();
        expect(state).toEqual(['foobar']);
    });
});


class SubjectObservable extends AppObservableObject<string> {}

describe('SubjectObservable', () => {

    it('object subscription works', () => {
        const testObj = new SubjectObservable();

        let state = null;
        testObj.observable.subscribe(_state => state = _state);

        // Adding new item should succeed
        testObj.setObject('bar');
        expect(state).toEqual('bar');
    });
});


class ReplayObservable extends AppObservablePersistentObject<string> {}

describe('ReplaySubjectObservable', () => {

    it('late subscription works', () => {
        const testObj = new ReplayObservable();

        testObj.setObject('bar');

        // Late subscription works
        let state = null;
        testObj.observable.subscribe(_state => state = _state);
        expect(state).toEqual('bar');
    });
});
