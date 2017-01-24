import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AlertMessage } from '../widgets';

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
        this.add_alert(message, 'success');
    }

    error(message: string) {
        this.add_alert(message, 'error');
    }

    info(message: string) {
        this.add_alert(message, 'info');
    }

    warning(message: string) {
        this.add_alert(message, 'warning');
    }

    private add_alert(message: string, type: string) {
        this.dataStore.alerts.push({id: this.dataStore.alerts.length, type: type, text: message});
        this._alerts.next(Object.assign({}, this.dataStore).alerts);
    }
}
