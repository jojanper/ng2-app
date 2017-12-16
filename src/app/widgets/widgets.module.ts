import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { SpinnerComponent } from './spinner';
import { DropDownComponent } from './dropdown';
import { AppEmptyViewComponent } from './base/base.component';

const COMPONENTS = [AppEmptyViewComponent, SpinnerComponent, DropDownComponent];

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
