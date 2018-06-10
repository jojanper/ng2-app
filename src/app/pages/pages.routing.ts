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
        path: APPROUTES['home'].url,
        component: HomeComponent,
        data: {
            config: {route: APPROUTES['home']}
        }
    },
    {
        path: APPROUTES['about'].url,
        component: AboutComponent,
        canActivate: [AuthGuard],
        data: {
            config: {route: APPROUTES['about']}
        }
    },
    {
        path: APPROUTES['api'].url,
        data: {
            config: {route: APPROUTES['api']}
        },
        loadChildren: './api/api.module#DraalAppPagesApiModule'
    },
    {
        path: APPROUTES['demo'].url,
        data: {
            config: {route: APPROUTES['demo']}
        },
        loadChildren: './demo/demo.module#DraalAppPagesDemoModule'
    },
    {
        path: APPROUTES['apps'].url,
        data: {
            config: {route: APPROUTES['apps']}
        },
        loadChildren: './apps/apps.module#DraalAppPagesAppsModule'
    },
    {
        path: APPROUTES['auth'].url,
        loadChildren: './auth/auth.module#DraalAppPagesAuthModule'
    },
    {
        path: '**',
        redirectTo: '/' + APPROUTES['default'].redirect
    }
];

export const DraalAppRoutes = RouterModule.forRoot(routes, {
    useHash: true,

    // Once bootstrapped, fetch all the remaining module chunks
    preloadingStrategy: PreloadAllModules
});
