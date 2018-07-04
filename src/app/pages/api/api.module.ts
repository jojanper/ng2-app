import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppEmptyViewComponent } from '../../utils/base';

import { DraalApiWorldbankModule } from './worldbank/worldbank.module';
import { DraalApiStarwarsModule } from './starwars/starwars.module';
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
        DraalApiStarwarsModule,
        DraalApiWorldbankModule,
        RouterModule.forChild(ROUTES)
    ]
})
export class DraalAppPagesApiModule {}
