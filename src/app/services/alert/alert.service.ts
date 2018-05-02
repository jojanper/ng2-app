import { Injectable } from '@angular/core';
import { timer } from 'rxjs/observable/timer';

import { AlertMessage, AlertMessageOptions } from './alert.type';
import { AppObservableArray } from '../../utils/base';


@Injectable()
export class AlertService extends AppObservableArray<AlertMessage> {

    constructor() {
        super();
    }

    success(message: string, options?: AlertMessageOptions) {
        this.addAlert(message, 'success', options);
    }

    error(message: string, options?: AlertMessageOptions) {
        this.addAlert(message, 'error', options);
    }

    info(message: string, options?: AlertMessageOptions) {
        this.addAlert(message, 'info', options);
    }

    warning(message: string, options?: AlertMessageOptions) {
        this.addAlert(message, 'warning', options);
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

    private addAlert(message: string, type: string, options?: AlertMessageOptions) {
        const msgObj = {id: this.arrayLength, type: type, text: message};
        this.addSubject(msgObj);

        // Message should disapper automatically after timeout period
        if (options && options.timeout) {
            timer(options.timeout).subscribe(() => this.removeAlert(msgObj));
        }
    }
}
