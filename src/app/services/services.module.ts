import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppEventsService } from './events/appevent.service';
import { ApiService } from './api/api.service';


@NgModule({
  imports: [CommonModule]
})
export class DraalServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DraalServicesModule,
      providers: [AppEventsService, ApiService]
    };
  }
}
