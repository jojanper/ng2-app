import { Observable } from 'rxjs';

import { AppObservableArray, AppObservableArrayModes } from './base.observable';


class TestObservable extends AppObservableArray<string> {}


describe('TestObservable', () => {

    const verify = (obj: TestObservable, fn: Function, expectedResult: any): void => {
        let state = null;
        obj.observable.subscribe(_state => {
            console.log(_state);
            state = _state;
        });

        fn();
        expect(state).toEqual(expectedResult);
    };

    fit('default mode is selected by constructor', () => {
        //verify(ProgressStates.SUBMITTED);
        //verify(ProgressStates.NULL);
        const testObj = new TestObservable('foo');
        verify(testObj, () => testObj.addSubject('bar'), ['bar']);
    });

    fit('supports persistent observable', () => {
        //verify(ProgressStates.SUBMITTED);
        //verify(ProgressStates.NULL);
        const testObj = new TestObservable(AppObservableArrayModes.PERSISTENT);

        testObj.addSubject('bar');
        testObj.addSubject('foo');;

        expect(testObj.arrayLength).toEqual(2);

        let state = null;
        testObj.observable.subscribe(_state => {
            console.log(_state);
            state = _state;
        });

        expect(state).toEqual(['bar', 'foo']);

        testObj.removeSubject((item) => {
            return (item === 'bar') ? true : false;
        });

        expect(state).toEqual(['foo']);

        testObj.removeAllSubjects();
        expect(state).toEqual([]);

        testObj.push(['oof']);
        expect(state).toEqual(['oof']);
        //expect(state).toEqual(['bar']);
        //verify(testObj, () => testObj.addSubject('bar'), ['bar']);
        //verify(testObj, () => testObj.addSubject('foo'), ['bar']);
    });

    fit('supports observable with initial value', () => {
        const testObj = new TestObservable(AppObservableArrayModes.EMPTY);

        let state = null;
        testObj.observable.subscribe(_state => state = _state);

        // Initial value is as expected
        expect(state).toEqual([]);

        // Adding new value succeeds
        testObj.addSubjects(['foo']);
        expect(state).toEqual(['foo']);
    });

    fit('sequence is completed', () => {
        let state = null;

        const testObj = new TestObservable(AppObservableArrayModes.EMPTY);
        Observable.forkJoin(testObj.observable).subscribe(results => state = results[0]);

        // Item is added to sequence, next and complete is called which will
        // fire the above forkJoin
        testObj.push(['foobar']);
        testObj.next();
        testObj.complete();
        expect(state).toEqual(['foobar']);
    });
});
