import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppEmptyViewComponent } from '../../utils/base';

import { DraalApiWorldbankModule } from './worldbank/worldbank.module';
import { DraalApiStarwarsModule } from './starwars/starwars.module';
import { DraalApiBreweryModule } from './brewery/brewery.module';
import { STARWARSROUTE } from './starwars/starwars.routing';
import { WORLDBANKROUTE } from './worldbank/worldbank.routing';
import { BREWERYROUTE } from './brewery/brewery.routing';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        STARWARSROUTE,
        WORLDBANKROUTE,
        BREWERYROUTE
    ]
}];


@NgModule({
    imports: [
        DraalApiStarwarsModule,
        DraalApiWorldbankModule,
        DraalApiBreweryModule,
        RouterModule.forChild(ROUTES)
    ]
})
export class DraalAppPagesApiModule {}
