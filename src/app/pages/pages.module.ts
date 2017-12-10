import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent, AboutComponent, DraalAppHeaderComponent,
    DraalAppFooterComponent, DraalAppRoutes } from './index';
import { DraalDataTableModule, DraalAlertModule,
    DraalFormsModule, AlertComponent, DraalWidgetsCoreModule } from '../widgets';
import { DraalServicesModule } from '../services';


@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),

        DraalAppRoutes,
        DraalDataTableModule.forRoot(),
        DraalFormsModule.forRoot(),
        DraalAlertModule.forRoot(),
        DraalWidgetsCoreModule.forRoot(),

        DraalServicesModule.forRoot()
    ],
    declarations: [DraalAppHeaderComponent, DraalAppFooterComponent, HomeComponent, AboutComponent],
    exports: [DraalAppHeaderComponent, DraalAppFooterComponent, AlertComponent]
})
export class DraalAppPagesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DraalAppPagesModule
        };
    }
}
