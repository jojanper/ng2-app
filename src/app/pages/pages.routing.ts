import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent, AboutComponent, PlanetsComponent, SpeciesDetailComponent } from './index';
import { AuthGuard } from '../services';
import { RouteManager } from '../router';
import { AppEmptyViewComponent } from '../widgets';

import { STARWARSROUTE } from './starwars/starwars.routing';


const appRoutes = RouteManager.ROUTES;

const getStarWarsRoutes = (config) => {
    return [
        {
            path: config['planets'].url,
            component: PlanetsComponent,
            data: {
                config: RouteManager.getConfig(config['planets'].name)
            }
        },
        {
            path: config['species'].url,
            component: AppEmptyViewComponent,
            data: {
                config: RouteManager.getConfig(config['species'].name)
            },
            children: [{
                path: config['species']['children']['detail'].url,
                component: SpeciesDetailComponent,
                data: {
                    config: RouteManager.getConfig(config['species']['children']['detail'].name)
                }
            }]
        }
    ];
};

export const getApiRoutes = () => {
    return {
        path: appRoutes['api'].url,
        component: AppEmptyViewComponent,
        data: {
            config: RouteManager.getConfig(appRoutes['api'].name)
        },
        children: [
            {
                path: appRoutes['api']['children']['starwars'].url,
                component: AppEmptyViewComponent,
                data: {
                    config: RouteManager.getConfig(appRoutes['api']['children']['starwars'].name)
                },
                children: getStarWarsRoutes(appRoutes['api']['children']['starwars'].children)
            }

        ]
    };
};

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
    //getApiRoutes(),

    {
        path: appRoutes['api'].url,
        component: AppEmptyViewComponent,
        data: {
            config: RouteManager.getConfig(appRoutes['api'].name)
        },
        children: [
            STARWARSROUTE
        ]
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

console.log(routes);

export const DraalAppRoutes = RouterModule.forRoot(routes, {
    useHash: true,

    // Once bootstrapped, fetch all the remaining module chunks
    preloadingStrategy: PreloadAllModules
});
