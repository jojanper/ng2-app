import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert.component';
import { AlertService } from '../../services';

@NgModule({
  imports: [CommonModule],
  declarations: [AlertComponent],
  exports: [AlertComponent]
})
export class DraalAlertModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DraalAlertModule,
      providers: [AlertService]
    };
  }
}
