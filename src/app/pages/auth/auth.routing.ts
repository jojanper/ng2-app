import { RouterModule, Routes } from '@angular/router';

import { AppEmptyViewComponent } from '../../utils/base';

import { RegisterComponent } from './registration';
import { LoginComponent } from './login';
import { LogoutComponent } from './logout';
import { ActivateComponent } from './activate';
import { PwResetRequestComponent } from './pwreset';
import { AUTHROUTES } from './auth.routes.config';

const CHILDROUTES = AUTHROUTES.children;

const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        {path: CHILDROUTES['auth.register'].url, component: RegisterComponent},
        {path: CHILDROUTES['auth.login'].url, component: LoginComponent},
        {path: CHILDROUTES['auth.logout'].url, component: LogoutComponent},
        {path: CHILDROUTES['auth.activate'].url, component: ActivateComponent},
        {path: CHILDROUTES['auth.pw-reset-request'].url, component: PwResetRequestComponent}
    ]
}];

export const DraalAuthRoutes = RouterModule.forChild(ROUTES);
