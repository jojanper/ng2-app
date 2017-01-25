import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AlertMessage } from './alert.type';
import { AlertService } from '../shared';

@Component({
    selector: 'dng2-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit {

    alerts: Observable<AlertMessage[]>;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alerts = this.alertService.alerts;
    }

    removeAlert(data: AlertMessage) {
        this.alertService.removeAlert(data);
    }
}
