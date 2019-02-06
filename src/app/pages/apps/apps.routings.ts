import { RouterModule, Routes } from '@angular/router';

import { CHATROUTE } from './pages/chat/chat.module';
import { TERMINALROUTE } from './pages/terminal/terminal.module';
import { AUDIOROUTE } from './pages/audio/audio.module';
import { AppEmptyViewComponent } from '../../utils/base';


const ROUTES: Routes = [{
    path: '', component: AppEmptyViewComponent,
    children: [
        CHATROUTE,
        TERMINALROUTE,
        AUDIOROUTE
    ]
}];

export const DraalAppsRoutes = RouterModule.forChild(ROUTES);
