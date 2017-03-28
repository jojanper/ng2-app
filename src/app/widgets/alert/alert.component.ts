import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AlertService, AlertMessage, AppEventsService } from '../../services';

@Component({
    selector: 'dng-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit {

    alerts: Observable<AlertMessage[]>;

    constructor(private alertService: AlertService, private appEvents: AppEventsService) { }

    ngOnInit() {
        this.alerts = this.alertService.alerts;

        // Subscribe to logout event
        this.appEvents.getObserver('logout').subscribe(() => {
            this.alertService.removeAll();
        });
    }

    removeAlert(data: AlertMessage) {
        this.alertService.removeAlert(data);
    }
}
