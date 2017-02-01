import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AlertMessage } from './alert.type';

@Injectable()
export class AlertService {

    alerts: Observable<AlertMessage[]>;
    private _alerts: BehaviorSubject<AlertMessage[]>;
    private dataStore: {
        alerts: AlertMessage[]
    };

    constructor() {
        this.dataStore = {alerts: []};
        this._alerts = <BehaviorSubject<AlertMessage[]>>new BehaviorSubject([]);
        this.alerts = this._alerts.asObservable();
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
        this.dataStore.alerts.forEach((t, i) => {
            if (t.id === message.id) { this.dataStore.alerts.splice(i, 1); }
        });
        this._alerts.next(Object.assign({}, this.dataStore).alerts);
    }

    removeAll() {
        this.dataStore.alerts = [];
        this._alerts.next(Object.assign({}, this.dataStore).alerts);
    }

    private addAlert(message: string, type: string) {
        this.dataStore.alerts.push({id: this.dataStore.alerts.length, type: type, text: message});
        this._alerts.next(Object.assign({}, this.dataStore).alerts);
    }
}
