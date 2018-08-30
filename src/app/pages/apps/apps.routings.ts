import { RouterModule, Routes } from '@angular/router';

import { CHATROUTE } from './chat/chat.module';
import { TERMINALROUTE } from './terminal/terminal.module';
import { AppEmptyViewComponent } from '../../utils/base';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        CHATROUTE,
        TERMINALROUTE
    ]
}];

export const DraalAppsRoutes = RouterModule.forChild(ROUTES);
