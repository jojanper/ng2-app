import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './registration';
import { LoginComponent } from './login';
import { LogoutComponent } from './logout';
import { ActivateComponent } from './activate';
import { AppEmptyViewComponent, DraalFormsModule } from '../../widgets';
import { RouteManager } from '../../router';


// URL settings for this module are located here
const authRoutes = RouteManager.ROUTES['auth'].children;

const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        {path: authRoutes['register'].url, component: RegisterComponent},
        {path: authRoutes['login'].url, component: LoginComponent},
        {path: authRoutes['logout'].url, component: LogoutComponent},
        {path: authRoutes['activate'].url, component: ActivateComponent}
    ]
}];


@NgModule({
    imports: [
        DraalFormsModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        LoginComponent,
        LogoutComponent,
        RegisterComponent,
        AppEmptyViewComponent
    ]
})
export class DraalAppPagesAuthModule {}
