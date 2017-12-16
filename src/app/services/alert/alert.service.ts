import { Injectable } from '@angular/core';

import { AlertMessage } from './alert.type';
import { AppObservableArray } from '../../widgets/base';


@Injectable()
export class AlertService extends AppObservableArray<AlertMessage> {

    constructor() {
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
        this.removeSubject(item => item.id === message.id);
    }

    get alerts() {
        return this.subjects;
    }

    removeAll() {
        this.removeAllSubjects();
    }

    private addAlert(message: string, type: string) {
        this.addSubject({id: this.arrayLength, type: type, text: message});
    }
}
