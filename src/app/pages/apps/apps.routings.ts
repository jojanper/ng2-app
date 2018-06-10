import { RouterModule, Routes } from '@angular/router';

import { CHATROUTE } from './chat/chat.module';
import { AppEmptyViewComponent } from '../../utils/base';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        CHATROUTE
    ]
}];

export const DraalAppsRoutes = RouterModule.forChild(ROUTES);
