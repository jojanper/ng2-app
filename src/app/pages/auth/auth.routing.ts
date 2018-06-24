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
        {path: CHILDROUTES[0].url, component: RegisterComponent},
        {path: CHILDROUTES[1].url, component: LoginComponent},
        {path: CHILDROUTES[2].url, component: LogoutComponent},
        {path: CHILDROUTES[3].url, component: ActivateComponent},
        {path: CHILDROUTES[4].url, component: PwResetRequestComponent}
    ]
}];

export const DraalAuthRoutes = RouterModule.forChild(ROUTES);
