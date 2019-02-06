import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppEmptyViewComponent } from '../../utils/base';

import { DraalApiWorldbankModule } from './worldbank/worldbank.module';
import { DraalApiStarwarsModule } from './starwars/starwars.module';
import { DraalApiMoviedbModule } from './themoviedb/moviedb.module';
import { STARWARSROUTE } from './starwars/starwars.routing';
import { WORLDBANKROUTE } from './worldbank/worldbank.routing';
import { MOVIEDBROUTE } from './themoviedb/moviedb.routing';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        STARWARSROUTE,
        WORLDBANKROUTE,
        MOVIEDBROUTE
    ]
}];


@NgModule({
    imports: [
        DraalApiStarwarsModule,
        DraalApiWorldbankModule,
        DraalApiMoviedbModule,
        RouterModule.forChild(ROUTES)
    ]
})
export class DraalAppPagesApiModule {}
