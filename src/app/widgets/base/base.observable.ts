import { Observable, ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


/**
 * Base class for managing an object as observable.
 */
export abstract class AppObservableObject<T> {
    observable: Observable<T>;
    protected subject: Subject<T> = new Subject<T>();

    constructor() {
        this.observable = this.subject.asObservable();
    }

    /**
     * Set next object.
     */
    protected setObject(subject: T): void {
        this.subject.next(subject);
    }
}

/**
 * Base class for managing an object as observable. Any late subscriptions will
 * replay the object.
 */
export abstract class AppObservablePersistentObject<T> {
    observable: Observable<T>;
    protected subject: ReplaySubject<T> = new ReplaySubject<T>();

    constructor() {
        this.observable = this.subject.asObservable();
    }

    /**
     * Set next item.
     */
    protected setObject(subject: T): void {
        this.subject.next(subject);
    }
}

/**
 * Function interface for validating item within AppObserverArray<T> class.
 */
interface SubjectComparisonFn<T> {
    (subject: T): boolean;
}

/**
 * Base class for managing an array of objects as observable. Interface methods
 * are available for controlling how and when the observable sequence is emitted.
 */
export abstract class BaseObservableArray<T> {
    observable: Observable<Array<T>>;
    private dataStore: {
        data: Array<T>
    };

    constructor(protected subjects: any) {
        this.dataStore = {data: []};
        this.observable = this.subjects.asObservable();
    }

    /**
     * Remove all items from the observable sequence and then emit the sequence.
     */
    removeAllSubjects(): void {
        this.dataStore.data = [];
        this.next();
    }

    /**
     * Return number of items available in the observable sequence.
     */
    get arrayLength(): number {
        return this.dataStore.data.length;
    }

    /**
     * Trigger completion of observable sequence.
     */
    complete() {
        this.subjects.complete();
    }

    /**
     * Add new items to observable sequence and emit the sequence.
     */
    addSubjects(subjects: Array<T>): void {
        this.dataStore.data = [];
        subjects.forEach(item => {
            this.dataStore.data.push(item);
        })
        this.next();
    }

    /**
     * Append new item to observable sequence and emit the sequence.
     */
    addSubject(subject: T): void {
        this.dataStore.data.push(subject);
        this.next();
    }

    /**
     * Append new items to observable sequence but do not emit the sequence.
     */
    push(subjects: Array<T>): void {
        subjects.forEach(subject => {
            this.dataStore.data.push(subject);
        });
    }

    /**
     * Emit the observable sequence.
     */
    next(): void {
        this.subjects.next(Object.assign({}, this.dataStore).data);
    }

    /**
     * Remove item(s) from observable sequence. The caller must provide comparison
     * implementation for the sequence removal check.
     */
    protected removeSubject(validatorFn: SubjectComparisonFn<T>): void {
        this.dataStore.data.forEach((t, i) => {
            if (validatorFn(t)) { this.dataStore.data.splice(i, 1); }
        });
        this.next();
    }
}

export const AppObservableArrayModes = {
    EMPTY: 'empty',
    PERSISTENT: 'persistent'
};

/**
 * Base class for managing an array of objects as observable.
 */
export abstract class AppObservableArray<T> extends BaseObservableArray<T> {
    /**
     * @param initMode Initialization mode. the following modes are supported:
     *  - empty: array of objects is initialized as empty list
     *  - persistent: array of objects is available also to late subscriptions
     */
    constructor(initMode = AppObservableArrayModes.EMPTY) {
        let observableSequence: any;

        switch (initMode) {
            case AppObservableArrayModes.EMPTY:
                observableSequence = new BehaviorSubject([]);
                break;

            case AppObservableArrayModes.PERSISTENT:
                observableSequence = new ReplaySubject<T>();
                break;

            default:
                observableSequence = new Subject();
        }

        super(observableSequence);
    }
}
