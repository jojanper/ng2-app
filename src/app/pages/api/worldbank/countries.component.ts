import { Component } from '@angular/core';

import { WorldBankRestApi } from './services/wbrest.service';
import { WorldBankBaseComponent } from './base.component';


@Component({
    selector: 'dng-wb.countries',
    template: require('./countries.component.html')
})
export class CountriesComponent extends WorldBankBaseComponent {

    constructor(api: WorldBankRestApi) {
        super(api);
    }
}
