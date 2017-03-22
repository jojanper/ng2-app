import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard } from './auth.guard';
import { LoginComponent, LogoutComponent } from './login';
import { DraalFormsModule } from '../widgets';

@NgModule({
  imports: [CommonModule, DraalFormsModule.forRoot()],
  declarations: [LoginComponent, LogoutComponent],
  exports: [LoginComponent, LogoutComponent]
})
export class DraalAuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DraalAuthModule,
      providers: [AuthGuard]
    };
  }
}
