import { RouterModule, Routes } from '@angular/router';

import { CHATROUTE } from './pages/chat/chat.module';
import { TERMINALROUTE } from './pages/terminal/terminal.module';
import { AppEmptyViewComponent } from '../../utils/base';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        CHATROUTE,
        TERMINALROUTE
    ]
}];

export const DraalAppsRoutes = RouterModule.forChild(ROUTES);
