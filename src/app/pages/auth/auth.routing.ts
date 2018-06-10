import { RouterModule, Routes } from '@angular/router';

import { AppEmptyViewComponent } from '../../utils/base';

import { RegisterComponent } from './registration';
import { LoginComponent } from './login';
import { LogoutComponent } from './logout';
import { ActivateComponent } from './activate';
import { PwResetRequestComponent } from './pwreset';
import { AUTHROUTES } from './auth.routes.config';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        {path: AUTHROUTES['auth.register'].url, component: RegisterComponent},
        {path: AUTHROUTES['auth.login'].url, component: LoginComponent},
        {path: AUTHROUTES['auth.logout'].url, component: LogoutComponent},
        {path: AUTHROUTES['auth.activate'].url, component: ActivateComponent},
        {path: AUTHROUTES['auth.pw-reset-request'].url, component: PwResetRequestComponent}
    ]
}];

export const DraalAuthRoutes = RouterModule.forChild(ROUTES);
