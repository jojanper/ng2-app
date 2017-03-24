import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesComponent, DataTablesColumnDirective } from './datatables.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DataTablesComponent, DataTablesColumnDirective],
  exports: [DataTablesComponent, DataTablesColumnDirective]
})
export class DraalDataTableModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DraalDataTableModule,
    };
  }
}
