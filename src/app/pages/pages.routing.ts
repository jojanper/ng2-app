import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { AuthGuard } from '../services';
import { APPROUTES } from './pages.routes.config';


/**
 * Application routes, some of the routes are lazy loaded.
 *
 * Reference to lazy loaded pages:
 * https://toddmotto.com/lazy-loading-angular-code-splitting-webpack
 */
const routes: Routes = [
    {
        path: APPROUTES[0].url,
        component: HomeComponent,
        data: {
            config: {route: APPROUTES[0]}
        }
    },
    {
        path: APPROUTES[1].url,
        component: AboutComponent,
        canActivate: [AuthGuard],
        data: {
            config: {route: APPROUTES[1]}
        }
    },
    {
        path: APPROUTES[3].url,
        data: {
            config: {route: APPROUTES[3]}
        },
        loadChildren: './api/api.module#DraalAppPagesApiModule'
    },
    {
        path: APPROUTES[2].url,
        data: {
            config: {route: APPROUTES[2]}
        },
        loadChildren: './demo/demo.module#DraalAppPagesDemoModule'
    },
    {
        path: APPROUTES[4].url,
        data: {
            config: {route: APPROUTES[4]}
        },
        loadChildren: './apps/apps.module#DraalAppPagesAppsModule'
    },
    {
        path: APPROUTES[5].url,
        loadChildren: './auth/auth.module#DraalAppPagesAuthModule'
    },
    {
        path: '**',
        redirectTo: '/' + APPROUTES[APPROUTES.length - 1].redirect
    }
];

export const DraalAppRoutes = RouterModule.forRoot(routes, {
    useHash: true,

    // Once bootstrapped, fetch all the remaining module chunks
    preloadingStrategy: PreloadAllModules
});
