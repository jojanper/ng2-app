import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';

import { DraalWidgetsCoreModule } from '../../../widgets';

import { BeersComponent, InfiniteScrollComponent } from './components';
import { FEATURE_NAME, reducers } from './store';

@NgModule({
    imports: [
        CommonModule,
        DraalWidgetsCoreModule,
        StoreModule.forFeature(FEATURE_NAME, reducers)
    ],
    providers: [
    ],
    declarations: [
        BeersComponent,
        InfiniteScrollComponent
    ],
    entryComponents: [
    ]
})
export class DraalApiBreweryModule {}
