import { Component } from '@angular/core';

import { AlertService } from '../../services';
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

    constructor(private alertService: AlertService) {

        this.renderSpeciesFn = this.renderSpecies.bind(this);
    }

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

    renderSpecies(data: any): string {
      return `<a href="${data.row.url}">${data.row[data.target]}</a>`;
    }
}
