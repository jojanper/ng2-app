import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DraalDataTableModule, DraalWidgetsCoreModule } from '../../../widgets';

import { CountriesComponent, WorldBankRestApi } from './index';


@NgModule({
    imports: [
        CommonModule,
        DraalDataTableModule,
        DraalWidgetsCoreModule
    ],
    providers: [
        WorldBankRestApi
    ],
    declarations: [
        CountriesComponent
    ]
})
export class DraalApiWorldbankModule {}
