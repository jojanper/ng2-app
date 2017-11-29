import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './spinner.component';


@NgModule({
    imports: [CommonModule],
    declarations: [SpinnerComponent],
    exports: [SpinnerComponent]
})
export class DraalSpinnerModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DraalSpinnerModule,
        };
    }
}
