import { Component } from '@angular/core';


@Component({
    selector: 'dng-wb.countries',
    template: require('./countries.component.html')
})
export class CountriesComponent {

    tableOptions = {
        baseUrl: 'http://api.worldbank.org/v2/countries',
        ajax: () => {
            this.ajax();
        }
    };

    ajax() {
        console.log('HEP');
    }
}
