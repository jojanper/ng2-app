import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent, AboutComponent } from './index';
import { AuthGuard } from '../widgets/auth';
import { RouteManager } from '../models';


const appRoutes = RouteManager.ROUTES;

/**
 * Application routes, some of the routes are lazy loaded.
 *
 * Reference to lazy loaded pages:
 * https://toddmotto.com/lazy-loading-angular-code-splitting-webpack
 */
const routes: Routes = [
    {path: appRoutes['home'].name, component: HomeComponent},
    {path: appRoutes['about'].name, component: AboutComponent, canActivate: [AuthGuard]},
    {path: appRoutes['demo'].name, loadChildren: './demo/demo.module#DraalAppPagesDemoModule'},
    {path: appRoutes['auth'].name, loadChildren: './auth/auth.module#DraalAppPagesAuthModule'},
    {path: '**', redirectTo: '/' + appRoutes['default'].name}
];

export const DraalAppRoutes = RouterModule.forRoot(routes, {
    useHash: true,

    // Once bootstrapped, fetch all the remaining module chunks
    preloadingStrategy: PreloadAllModules
});
