import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DemoFormComponent } from './form';
import { DemoDialogComponent } from './dialog';
import { DemoDragDropComponent } from './dragdrop';
import { DemoComponent } from './demo.component';
import { DraalServicesModule } from '../../services';
import { DraalDataTableModule, DraalAlertModule, DraalFormsModule,
    DraalWidgetsCoreModule, SpinnerComponent, RouteComponent } from '../../widgets';


const ROUTES: Routes = [{
    path: '', component: DemoComponent
}];


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        DragDropModule,

        DraalFormsModule,
        DraalDataTableModule,
        DraalAlertModule,
        DraalServicesModule,
        DraalWidgetsCoreModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        DemoFormComponent,
        DemoDialogComponent,
        DemoDragDropComponent,
        DemoComponent
    ],
    entryComponents: [
        DemoComponent,
        SpinnerComponent,
        RouteComponent
    ]
})
export class DraalAppPagesDemoModule {}
