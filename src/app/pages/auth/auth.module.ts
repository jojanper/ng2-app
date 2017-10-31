import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './registration';
import { LoginComponent, LogoutComponent } from './login';
import { AppEmptyViewComponent, DraalFormsModule } from '../../widgets';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        {path: 'register', component: RegisterComponent},
        {path: 'login', component: LoginComponent},
        {path: 'logout', component: LogoutComponent}
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
