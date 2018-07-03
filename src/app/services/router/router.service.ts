import { Injectable } from '@angular/core';
import { Router, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { RouteConfig } from '../../models';
import { RouteManagerInterface } from '../../utils';


@Injectable()
export class RouterService {
    protected appRoutes: RouteConfig;
    protected manager: RouteManagerInterface;
    protected headerMenuItems: Array<string>;

    constructor(router: Router) {
        this.manager = null;
        this.appRoutes = null;

        // Include new routes to route resolver
        router.events.pipe(
            filter(event => event instanceof RouteConfigLoadEnd)
        ).subscribe((data: RouteConfigLoadEnd) => this.addLoadedRoutes(router, data));
    }

    resolveByName(name: string, params?: any): string {
        return this.manager.resolveByName(name, params);
    }

    topMenuItems(position: string): Array<any> {
        return this.manager.topMenuItems(position);
    }

    /**
     * Set initial application routes for URL resolver. The application is expected
     * call this method during boot up.
     *
     * @param appRoutes Application routes.
     * @param headerMenuItems Header menu routes.
     */
    setInitialRoutes(appRoutes: RouteConfig, headerMenuItems: Array<string>) {
        this.appRoutes = appRoutes;
        this.headerMenuItems = headerMenuItems;
        this.manager = RouteManagerInterface.create(this.appRoutes, headerMenuItems);
    }

    private addLoadedRoutes(router: Router, data: RouteConfigLoadEnd): void {
        // Trigger change detection so _loadedConfig is available in router
        setTimeout(() => {
            // Router config that corresponds to loaded config
            const childRoute = router.config.find(route => route.path === data.route.path);

            // Application route config that corresponds to loaded config. Note that currently
            // only paths from 1st level are checked!
            const appConfigRoute = this.appRoutes.find(route => route.url === data.route.path);

            // Get the child routes config from loaded config
            const routeConfigChildren = [];
            const routes = childRoute['_loadedConfig'].routes[0].children || [];
            routes.forEach((route) => {
                if (route.data && route.data.config && route.data.config.route) {
                    routeConfigChildren.push(route.data.config.route);
                }
            });

            // Attach the child routes config to application routes object
            if (routeConfigChildren.length) {
                appConfigRoute.children = routeConfigChildren;
                this.manager = RouteManagerInterface.create(this.appRoutes, this.headerMenuItems);
            }
        }, 0);
    }
}
