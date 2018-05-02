import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppEmptyViewComponent } from '../../utils/base';
import { DraalFormsModule, DraalWidgetsCoreModule } from '../../widgets';

import { RegisterComponent } from './registration';
import { LoginComponent } from './login';
import { LogoutComponent } from './logout';
import { ActivateComponent } from './activate';
import { AUTHROUTES } from './auth.routes.config';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        {path: AUTHROUTES['register'].url, component: RegisterComponent},
        {path: AUTHROUTES['login'].url, component: LoginComponent},
        {path: AUTHROUTES['logout'].url, component: LogoutComponent},
        {path: AUTHROUTES['activate'].url, component: ActivateComponent}
    ]
}];


@NgModule({
    imports: [
        DraalFormsModule,
        DraalWidgetsCoreModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        LoginComponent,
        LogoutComponent,
        ActivateComponent,
        RegisterComponent
    ]
})
export class DraalAppPagesAuthModule {}
