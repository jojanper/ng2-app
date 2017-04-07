import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export abstract class AppObserver<T> {
    observer: Observable<T>;
    protected subject: Subject<T> = new Subject<T>();

    constructor() {
        this.observer = this.subject.asObservable();
    }

    protected setNextData(data: any): void {
        this.subject.next(data);
    }
}

export abstract class AppObserverArray<T> {
    observer: Observable<Array<T>>;
    protected subjects: BehaviorSubject<Array<T>>;
    protected dataStore: {
        data: Array<T>
    };

    constructor() {
        this.dataStore = {data: []};
        this.subjects = <BehaviorSubject<Array<T>>>new BehaviorSubject([]);
        this.observer = this.subjects.asObservable();
    }

    removeAllSubjects() {
        this.dataStore.data = [];
        this.subjects.next(Object.assign({}, this.dataStore).data);
    }

    protected addSubject(subject: T) {
        this.dataStore.data.push(subject);
        this.subjects.next(Object.assign({}, this.dataStore).data);
    }
}
