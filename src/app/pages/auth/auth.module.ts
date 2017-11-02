import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './registration';
import { LoginComponent, LogoutComponent } from './login';
import { AppEmptyViewComponent, DraalFormsModule } from '../../widgets';
import { RouteManager } from '../../models';


const authRoutes = RouteManager.ROUTES['auth'].children;

const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        {path: authRoutes['register'].name, component: RegisterComponent},
        {path: authRoutes['login'].name, component: LoginComponent},
        {path: authRoutes['logout'].name, component: LogoutComponent}
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
