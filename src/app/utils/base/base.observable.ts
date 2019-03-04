import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { takeWhile } from 'rxjs/operators';
import { Observable, Subscription, ReplaySubject, Subject, BehaviorSubject } from 'rxjs';


/**
 * Base class for managing an object as observable.
 */
export abstract class BaseObservableObject<T> {
    observable: Observable<T>;
    protected subject: Subject<T>;
    protected destroy = false;

    constructor(subject: Subject<T>) {
        this.subject = subject;
        this.observable = this.subject.asObservable();
    }

    /**
     * Return observable that closes when `closeSubject` method is called.
     */
    asPipe(): Observable<T> {
        return this.observable.pipe(
            takeWhile(() => this.destroy === false)
        );
    }

    /**
     * Close subject from emitting further values.
     */
    closeSubject() {
        this.destroy = true;
    }

    /**
     * Set next object.
     */
    setObject(subject: T): void {
        this.subject.next(subject);
    }
}

/**
 * Base class for managing an object as Subject.
 */
export abstract class AppObservableObject<T> extends BaseObservableObject<T> {
    constructor() {
        super(new Subject<T>());
    }
}

/**
 * Base class for managing an object as ReplaySubject. Any late subscriptions will
 * replay the object.
 */
export abstract class AppObservablePersistentObject<T> extends BaseObservableObject<T> {
    constructor() {
        super(new ReplaySubject<T>());
    }
}

/**
 * Function interface for validating item within AppObserverArray<T> class.
 */
type SubjectComparisonFn<T> = (subject: T) => boolean;

/**
 * Base class for managing an array of objects as observable. Interface methods
 * are available for controlling how and when the observable sequence is emitted.
 */
export abstract class BaseObservableArray<T> {
    observable: Observable<Array<T>>;
    private dataStore: {
        data: Array<T>
    };

    constructor(public subjects: any) {
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
        });
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
    removeSubject(validatorFn: SubjectComparisonFn<T>): void {
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


export abstract class AppDataSource<T> extends DataSource<T> {
    private pageSize;
    private cachedData: Array<T>;
    private fetchedPages = new Set<number>();
    private dataStream = new BehaviorSubject<T[]>([]);
    private subscription = new Subscription();

    constructor() {
        super();
    }

    connect(collectionViewer: CollectionViewer): Observable<T[]> {
        // Load the initial data that will start the virtual scrolling
        this.getData(1, true);

        // Subcscribe to new data requests
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            const startPage = this.getPageForIndex(range.start);
            const endPage = this.getPageForIndex(range.end - 1);
            for (let i = startPage; i <= endPage; i++) {
                this.fetchPage(i);
            }
        }));

        return this.dataStream;
    }

    disconnect(): void {
        this.subscription.unsubscribe();
    }

    private getPageForIndex(index: number): number {
        return Math.floor(index / this.pageSize);
    }

    private fetchPage(page: number) {
        if (this.fetchedPages.has(page)) {
            return;
        }

        this.getData(page + 1, false);
    }

    protected setInitialData(pageSize: number, dataCount: number) {
        this.fetchedPages.add(0);
        this.pageSize = pageSize;
        this.cachedData = Array.from<T>({length: dataCount});
    }

    protected setData(data: Array<any>, page: number): void {
        const start = page * this.pageSize;
        this.cachedData.splice(start, data.length, ...data);
        this.dataStream.next(this.cachedData);
    }

    abstract getData(page: number, initialize: boolean): void;
}


export class NumberValueObserver extends AppObservableObject<number> { }
