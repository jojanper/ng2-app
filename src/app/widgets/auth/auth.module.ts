import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AuthGuard } from './auth.guard';
// import { LoginComponent, LogoutComponent } from './login';
// import { RegisterComponent } from './registration';
// import { DraalFormsModule } from '../form/form.module';

@NgModule({
  imports: [CommonModule/*, DraalFormsModule.forRoot()*/],
  // declarations: [LoginComponent, LogoutComponent, RegisterComponent],
  // exports: [LoginComponent, LogoutComponent, RegisterComponent]
})
export class DraalAuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DraalAuthModule,
      providers: [CookieService, AuthGuard]
    };
  }
}
