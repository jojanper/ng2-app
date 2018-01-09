import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent, AboutComponent } from './index';
import { AuthGuard } from '../services';
import { RouteManager } from '../router';

const appRoutes = RouteManager.ROUTES;

/**
 * Application routes, some of the routes are lazy loaded.
 *
 * Reference to lazy loaded pages:
 * https://toddmotto.com/lazy-loading-angular-code-splitting-webpack
 */
const routes: Routes = [
    {
        path: appRoutes['home'].url,
        component: HomeComponent,
        data: {
            config: RouteManager.getConfig(appRoutes['home'].name)
        }
    },
    {
        path: appRoutes['api'].url,
        loadChildren: './api/api.module#DraalAppPagesApiModule',
        data: {
            config: RouteManager.getConfig(appRoutes['api'].name)
        }
    },
    {
        path: appRoutes['about'].url,
        component: AboutComponent,
        canActivate: [AuthGuard],
        data: {
            config: RouteManager.getConfig(appRoutes['about'].name)
        }
    },
    {
        path: appRoutes['demo'].url,
        loadChildren: './demo/demo.module#DraalAppPagesDemoModule',
        data: {
            config: RouteManager.getConfig(appRoutes['demo'].name)
        }
    },
    {
        path: appRoutes['auth'].url,
        loadChildren: './auth/auth.module#DraalAppPagesAuthModule'
    },
    {
        path: '**',
        redirectTo: '/' + appRoutes['default'].redirect
    }
];

export const DraalAppRoutes = RouterModule.forRoot(routes, {
    useHash: true,

    // Once bootstrapped, fetch all the remaining module chunks
    preloadingStrategy: PreloadAllModules
});
