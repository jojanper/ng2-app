import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AppEmptyViewComponent, DraalDataTableModule,
    DraalWidgetsCoreModule } from '../../widgets';
import { PlanetsComponent, SpeciesDetailComponent,
    StarWarsApiService } from './starwars';
import { STARWARSROUTE } from './starwars/starwars.routing';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        STARWARSROUTE
    ]
}];


@NgModule({
    imports: [
        CommonModule,
        DraalDataTableModule,
        DraalWidgetsCoreModule,
        RouterModule.forChild(ROUTES)
    ],
    providers: [StarWarsApiService],
    declarations: [
        PlanetsComponent,
        SpeciesDetailComponent
    ]
})
export class DraalAppPagesApiModule {}
