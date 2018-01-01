import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { SpinnerComponent } from './spinner';
import { DropDownComponent } from './dropdown';
import { AppEmptyViewComponent } from './base';
import { RouteComponent } from './link';
import { SideMenuComponent } from './menu';

const COMPONENTS = [AppEmptyViewComponent, SpinnerComponent, DropDownComponent,
    RouteComponent, SideMenuComponent];

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
