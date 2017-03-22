import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent, AboutComponent, DemoComponent, AppFormComponent } from './index';
import { WidgetDtComponent, DraalAlertModule, DraalFormsModule, AlertComponent } from '../widgets';
import { DraalServicesModule } from '../services';
import { DraalAuthModule } from '../auth';


@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        DraalFormsModule.forRoot(),
        DraalAlertModule.forRoot(),
        DraalAuthModule.forRoot(),
        DraalServicesModule.forRoot()
    ],
    declarations: [WidgetDtComponent, HomeComponent, AboutComponent, DemoComponent, AppFormComponent],
    exports: [WidgetDtComponent, HomeComponent, AboutComponent, DemoComponent, AppFormComponent, AlertComponent]
})
export class DraalAppPagesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DraalAppPagesModule
        };
    }
}
