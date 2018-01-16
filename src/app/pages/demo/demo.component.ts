import { Component } from '@angular/core';

import { AlertService, RealTimeService } from '../../services';
import { Species } from './tables/species-data';
import { PersonnelData } from './tables/personnel-data';


@Component({
    selector: 'dng-demo',
    template: require('./demo.component.html')
})
export class DemoComponent {

    species = Species;
    personnel = PersonnelData;

    protected renderSpeciesFn: Function;

    tableOptions = {
    };

    constructor(private alertService: AlertService, private socket: RealTimeService) {

        this.renderSpeciesFn = this.renderSpecies.bind(this);

        this.socket.initSocket();
        this.socket.onMessage().subscribe(data => {
            console.log(data);
        })
    }

    addSuccessAlert() {
        this.socket.send({data: 'Send data'});
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

    renderSpecies(data: any): string {
      return `<a href="${data.row.url}">${data.row[data.target]}</a>`;
    }
}
