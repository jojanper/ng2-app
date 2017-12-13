import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent, AboutComponent, PlanetsComponent } from './index';
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
    {path: appRoutes['home'].url, component: HomeComponent},
    {path: appRoutes['planets'].url, component: PlanetsComponent},
    {path: appRoutes['about'].url, component: AboutComponent, canActivate: [AuthGuard]},
    {path: appRoutes['demo'].url, loadChildren: './demo/demo.module#DraalAppPagesDemoModule'},
    {path: appRoutes['auth'].url, loadChildren: './auth/auth.module#DraalAppPagesAuthModule'},
    {path: '**', redirectTo: '/' + appRoutes['default'].redirect}
];

export const DraalAppRoutes = RouterModule.forRoot(routes, {
    useHash: true,

    // Once bootstrapped, fetch all the remaining module chunks
    preloadingStrategy: PreloadAllModules
});
