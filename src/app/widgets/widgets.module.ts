import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { AppEmptyViewComponent } from '../utils/base';

import { SpinnerComponent } from './spinner';
import { DropDownComponent } from './dropdown';
import { RouteComponent } from './link';
import { SideMenuComponent, BreadcrumbComponent, UserMenuComponent } from './menu';
import { ScrollerDirective } from './directives';

const COMPONENTS = [
    AppEmptyViewComponent,
    SpinnerComponent,
    DropDownComponent,
    RouteComponent,
    SideMenuComponent,
    BreadcrumbComponent,
    UserMenuComponent,
    ScrollerDirective
];

@NgModule({
    imports: [CommonModule, NgbModule, RouterModule],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class DraalWidgetsCoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DraalWidgetsCoreModule,
        };
    }
}
