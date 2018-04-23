import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { DraalAppHeaderComponent } from './header';
import { DraalAppFooterComponent } from './footer';
import { DraalAppRoutes } from './pages.routing';
import { DraalDataTableModule, DraalAlertModule,
    DraalFormsModule, AlertComponent, DraalWidgetsCoreModule, RouteComponent,
    SideMenuComponent, BreadcrumbComponent } from '../widgets';
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
    declarations: [
        DraalAppHeaderComponent,
        DraalAppFooterComponent,
        HomeComponent,
        AboutComponent
    ],
    exports: [
        DraalAppHeaderComponent,
        DraalAppFooterComponent,
        AlertComponent,
        SideMenuComponent,
        BreadcrumbComponent
    ],
    entryComponents: [
        RouteComponent
    ]
})
export class DraalAppPagesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DraalAppPagesModule
        };
    }
}
