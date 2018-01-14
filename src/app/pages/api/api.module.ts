import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AppEmptyViewComponent, DraalDataTableModule,
    DraalWidgetsCoreModule } from '../../widgets';
import { PlanetsComponent, SpeciesDetailComponent,
    StarWarsApiService } from './starwars';
import { CountriesComponent, WorldBankRestApi } from './worldbank';
import { STARWARSROUTE } from './starwars/starwars.routing';
import { WORLDBANKROUTE } from './worldbank/worldbank.routing';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        STARWARSROUTE,
        WORLDBANKROUTE
    ]
}];


@NgModule({
    imports: [
        CommonModule,
        DraalDataTableModule,
        DraalWidgetsCoreModule,
        RouterModule.forChild(ROUTES)
    ],
    providers: [StarWarsApiService, WorldBankRestApi],
    declarations: [
        PlanetsComponent,
        SpeciesDetailComponent,
        CountriesComponent
    ]
})
export class DraalAppPagesApiModule {}
