import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesComponent } from './datatables.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DataTablesComponent],
  exports: [DataTablesComponent]
})
export class DraalDataTableModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DraalDataTableModule,
    };
  }
}
