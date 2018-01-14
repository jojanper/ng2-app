import { Component } from '@angular/core';

import { WorldBankRestApi } from './services/wbrest.service';


@Component({
    selector: 'dng-wb.countries',
    template: require('./countries.component.html')
})
export class CountriesComponent {

    tableOptions = {
        ajax: (data, callback) => {
            this.ajax(data, callback);
        }
    };

    constructor(private api: WorldBankRestApi) {}

    ajax(data, callback) {
        this.api.getData(true, 'countries', data, callback);
    }
}
