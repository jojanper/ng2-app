import { Component } from '@angular/core';

import { NetworkService, ConnectionOptions } from '../../../services';


@Component({
    selector: 'dng-wb.countries',
    template: require('./countries.component.html')
})
export class CountriesComponent {

    tableOptions = {
        baseUrl: 'https://api.worldbank.org/v2/countries',
        ajax: (data, callback) => {
            this.ajax(data, callback);
        }
    };

    private connectionOptions: ConnectionOptions;

    constructor(private network: NetworkService) {
        this.connectionOptions = new ConnectionOptions();
        this.connectionOptions.cors = true;
    }

    ajax(data, callback) {
        console.log('HEP');
        const url = this.tableOptions.baseUrl;
        this.connectionOptions.params = Object.assign({}, data, {format: 'json'});
        this.network.get(url, this.connectionOptions).subscribe((response) => {
            callback({data: response[1]});
        });
    }
}
