import { Component } from '@angular/core';

import { AlertService } from '../services';

@Component({
  selector: 'dng2-demo',
  template: require('./demo.component.html'),
})
export class DemoComponent {

  constructor(private alertService: AlertService) {}

  addSuccessAlert() {
    this.alertService.success('Success');
  }

  addInfoAlert() {
    this.alertService.info('Info');
  }

  addWarningAlert() {
    this.alertService.warning('Warning');
  }

  addErrorAlert() {
    this.alertService.error('Error');
  }
}
