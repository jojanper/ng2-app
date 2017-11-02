import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AuthGuard } from './auth.guard';

@NgModule({
  imports: [CommonModule]
})
export class DraalAuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DraalAuthModule,
      providers: [CookieService, AuthGuard]
    };
  }
}
