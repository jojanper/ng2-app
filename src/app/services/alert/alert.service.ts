import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AlertMessage } from './alert.type';
import { AppObserverArray } from '../../base';


@Injectable()
export class AlertService extends AppObserverArray<AlertMessage> {

    //alerts: Observable<AlertMessage[]>;
    //private alertSubjects: BehaviorSubject<AlertMessage[]>;
    //private dataStore: {
    //    alerts: AlertMessage[]
    //};

    constructor() {
        //this.dataStore = {alerts: []};
        //this.alertSubjects = <BehaviorSubject<AlertMessage[]>>new BehaviorSubject([]);
        //this.alerts = this.alertSubjects.asObservable();
        super();
    }

    success(message: string) {
        this.addAlert(message, 'success');
    }

    error(message: string) {
        this.addAlert(message, 'error');
    }

    info(message: string) {
        this.addAlert(message, 'info');
    }

    warning(message: string) {
        this.addAlert(message, 'warning');
    }

    removeAlert(message: AlertMessage) {
        this.dataStore.data.forEach((t, i) => {
            if (t.id === message.id) { this.dataStore.data.splice(i, 1); }
        });
        this.subjects.next(Object.assign({}, this.dataStore).data);
    }

    get alerts() {
        return this.subjects;
    }

    removeAll() {
        //this.dataStore.alerts = [];
        //this.alertSubjects.next(Object.assign({}, this.dataStore).alerts);
        this.removeAllSubjects();
    }

    private addAlert(message: string, type: string) {
        this.addSubject({id: this.dataStore.data.length, type: type, text: message});
        /*
        this.dataStore.alerts.push({id: this.dataStore.alerts.length, type: type, text: message});
        this.alertSubjects.next(Object.assign({}, this.dataStore).alerts);
        */
    }
}
