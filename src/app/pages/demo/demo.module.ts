import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppFormComponent } from './form';
import { DemoComponent } from './demo.component';
import { DraalServicesModule } from '../../services';
import { DraalDataTableModule, DraalAlertModule, DraalFormsModule/*, AlertComponent*/ } from '../../widgets';
// import { LoginComponent, LogoutComponent, RegisterComponent } from '../../widgets/auth';


export const ROUTES: Routes = [{
    path: '', component: DemoComponent
}];


@NgModule({
    imports: [
        NgbModule,

        DraalFormsModule,
        DraalDataTableModule,
        DraalAlertModule,
        // AppFormComponent,
        DraalServicesModule,
        // AlertComponent,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        // AlertComponent,
        AppFormComponent,
        DemoComponent
    ]
})
export class DraalAppPagesDemoModule {}
