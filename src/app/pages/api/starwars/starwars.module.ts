import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DraalDataTableModule, DraalWidgetsCoreModule } from '../../../widgets';

import { PlanetsComponent, SpeciesDetailComponent, StarWarsApiService } from './index';


@NgModule({
    imports: [
        CommonModule,
        DraalDataTableModule,
        DraalWidgetsCoreModule
    ],
    providers: [
        StarWarsApiService
    ],
    declarations: [
        PlanetsComponent,
        SpeciesDetailComponent
    ]
})
export class DraalApiStarwarsModule {}
