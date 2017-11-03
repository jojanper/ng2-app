import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './registration';
import { LoginComponent, LogoutComponent } from './login';
import { AppEmptyViewComponent, DraalFormsModule } from '../../widgets';
import { RouteManager } from '../../models';


// URL settings for this module are located here
const authRoutes = RouteManager.ROUTES['auth'].children;

const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        {path: authRoutes['register'].url, component: RegisterComponent},
        {path: authRoutes['login'].url, component: LoginComponent},
        {path: authRoutes['logout'].url, component: LogoutComponent}
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
