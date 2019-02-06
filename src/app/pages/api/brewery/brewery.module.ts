import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DraalWidgetsCoreModule } from '../../../widgets';

import { BeersComponent } from './components';


@NgModule({
    imports: [
        CommonModule,
        DraalWidgetsCoreModule
    ],
    providers: [
    ],
    declarations: [
        BeersComponent
    ],
    entryComponents: [
    ]
})
export class DraalApiBreweryModule {}
