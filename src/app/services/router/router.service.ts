import { Injectable } from '@angular/core';
import { Router, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { RouteConfig } from '../../models';
import { RouteManagerInterface } from '../../utils';


@Injectable()
export class RouterService {
    protected appRoutes: RouteConfig;
    protected manager: RouteManagerInterface;

    constructor(router: Router) {
        this.manager = null;
        this.appRoutes = null;

        router.events.pipe(
            filter(event => event instanceof RouteConfigLoadEnd)
        ).subscribe((data: RouteConfigLoadEnd) => {
            console.log(data);
            setTimeout(() => {
                const childRoute = router.config.find(route => route.path === data.route.path);
                // console.log(childRoute['_loadedConfig']);
                if (childRoute/*this.appRoutes[data.route.path]*/) {
                    // console.log(data.route);
                    // console.log(router);
                    // console.log(router.config[2]['_loadedConfig']);
                    // console.log(Object.keys(data.route));
                    // console.log(data.route['path']);
                    // console.log(data.route['_loadedConfig']);
                    //console.log(this.appRoutes[data.route.path]);
                    //console.log(childRoute['_loadedConfig']);

                    console.log(childRoute['_loadedConfig'], data, this.appRoutes);
                }
            }, 0);
        });
    }

    resolveByName(name: string, params?: any): string {
        return this.manager.resolveByName(name, params);
    }

    topMenuItems(position: string): Array<any> {
        return this.manager.topMenuItems(position);
    }

    setInitialRoutes(appRoutes: RouteConfig, headerMenuItems: Array<string>) {
        this.appRoutes = appRoutes;
        this.manager = RouteManagerInterface.create(this.appRoutes, headerMenuItems);
    }
}
