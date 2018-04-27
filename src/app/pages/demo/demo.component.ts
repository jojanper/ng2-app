import { Component } from '@angular/core';

import { AlertService } from '../../services';
import { Species } from './tables/species-data';
import { PersonnelData } from './tables/personnel-data';
import { DropdownItem } from '../../widgets';


@Component({
    selector: 'dng-demo',
    template: require('./demo.component.html')
})
export class DemoComponent {

    species = Species;
    personnel = PersonnelData;

    protected renderSpeciesFn: Function;

    protected menuItems = [
        DropdownItem.createAsLink({
            url: 'http://google.fi',
            title: 'Google'
        }),
        DropdownItem.createAsLink({
            url: 'http://yle.fi',
            title: 'Yle'
        }),
        DropdownItem.createAsDivider(),
        DropdownItem.createAsLink({
            url: 'http://nokia.fi',
            title: 'Nokia'
        }),
        DropdownItem.createAsCallback({
            url: '',
            title: 'Nokia'
        }, () => {
            console.log(this);
        })
    ];

    tableOptions = {
    };

    constructor(private alertService: AlertService) {

        this.renderSpeciesFn = this.renderSpecies.bind(this);
    }

    addSuccessAlert() {
        this.alertService.success('Success');
    }

    addInfoAlert() {
        this.alertService.info('Info, timeout 5 seconds', {timeout: 5000});
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
