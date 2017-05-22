import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent, AboutComponent, DemoComponent, AppFormComponent,
    DraalAppHeaderComponent, DraalAppFooterComponent, DraalAppRoutes } from './index';
import { DraalDataTableModule, DraalAlertModule, DraalFormsModule, AlertComponent } from '../widgets';
import { DraalServicesModule } from '../services';
import { DraalAuthModule } from '../auth';
import { AppEmptyViewComponent } from '../base';

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),

        DraalAppRoutes,
        DraalDataTableModule.forRoot(),
        DraalFormsModule.forRoot(),
        DraalAlertModule.forRoot(),
        DraalAuthModule.forRoot(),
        DraalServicesModule.forRoot()
    ],
    declarations: [DraalAppHeaderComponent, DraalAppFooterComponent, HomeComponent, AboutComponent,
        DemoComponent, AppFormComponent, AppEmptyViewComponent],
    exports: [DraalAppHeaderComponent, DraalAppFooterComponent, HomeComponent, AboutComponent,
        DemoComponent, AppFormComponent, AlertComponent, AppEmptyViewComponent]
})
export class DraalAppPagesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DraalAppPagesModule
        };
    }
}
