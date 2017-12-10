import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SpinnerComponent } from './spinner';
import { DropDownComponent } from './dropdown';

const COMPONENTS = [SpinnerComponent, DropDownComponent];

@NgModule({
    imports: [CommonModule, NgbModule],
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
