import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent, AboutComponent/*, PlanetsComponent/*, SpeciesDetailComponent*/ } from './index';
import { AuthGuard } from '../services';
import { RouteManager } from '../router';
import { AppEmptyViewComponent } from '../widgets';


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
        component: HomeComponent
    },
    {
        path: appRoutes['starwars'].url,
        component: AppEmptyViewComponent,
        data: {
            config: RouteManager.getConfig(appRoutes['starwars'].name)
        },
        children: [
            {
                path: appRoutes['starwars']['children']['planets'].url,
                component: AppEmptyViewComponent,
                data: {
                    config: RouteManager.getConfig(appRoutes['starwars']['children']['planets'].name)
                }
            },
            {
                path: appRoutes['starwars']['children']['species'].url,
                component: AppEmptyViewComponent,
                data: {
                    config: RouteManager.getConfig(appRoutes['starwars']['children']['species'].name)
                }
            }
        ]
    },
    /*
    {path: appRoutes['species'].url, component: AppEmptyViewComponent, children: [
        {
            path: appRoutes['species']['children']['detail'].url,
            component: SpeciesDetailComponent,
            data: {
                config: RouteManager.getConfig(appRoutes['species']['children']['detail'].name)
            }
        }
    ]},
    */
    {
        path: appRoutes['about'].url,
        component: AboutComponent,
        canActivate: [AuthGuard]
    },
    {
        path: appRoutes['demo'].url,
        loadChildren: './demo/demo.module#DraalAppPagesDemoModule'
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
