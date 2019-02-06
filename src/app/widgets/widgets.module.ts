import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppEmptyViewComponent } from '../utils/base';

import { SpinnerComponent } from './spinner';
import { DropDownComponent } from './dropdown';
import { RouteComponent } from './link';
import { DragDropComponent } from './dragdrop';
import { SideMenuComponent, BreadcrumbComponent, UserMenuComponent } from './menu';

const COMPONENTS = [
    AppEmptyViewComponent, SpinnerComponent, DropDownComponent,
    RouteComponent, SideMenuComponent, BreadcrumbComponent,
    UserMenuComponent, DragDropComponent
];

@NgModule({
    imports: [CommonModule, NgbModule, RouterModule, DragDropModule],
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
