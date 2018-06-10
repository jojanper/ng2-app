import { NgModule } from '@angular/core';

import { DraalFormsModule, DraalWidgetsCoreModule } from '../../widgets';

import { RegisterComponent } from './registration';
import { LoginComponent } from './login';
import { LogoutComponent } from './logout';
import { ActivateComponent } from './activate';
import { PwResetRequestComponent } from './pwreset';
import { DraalAuthRoutes } from './auth.routing';


@NgModule({
    imports: [
        DraalFormsModule,
        DraalWidgetsCoreModule,
        DraalAuthRoutes
    ],
    declarations: [
        LoginComponent,
        LogoutComponent,
        ActivateComponent,
        RegisterComponent,
        PwResetRequestComponent
    ]
})
export class DraalAppPagesAuthModule {}
