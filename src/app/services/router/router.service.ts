import { Injectable } from '@angular/core';
import { Router, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { RouteConfig } from '../../models';
import { RouteManagerInterface } from '../../utils';


@Injectable()
export class RouterService {
    manager: RouteManagerInterface;

    constructor(router: Router) {
        this.manager = null;

        router.events.pipe(
            filter(event => event instanceof RouteConfigLoadEnd)
        ).subscribe((data) => {
            console.log(data);
        });
    }

    resolveByName(name: string, params?: any): string {
        return this.manager.resolveByName(name, params);
    }

    topMenuItems(position: string): Array<any> {
        return this.manager.topMenuItems(position);
    }

    setIntialRoutes(appRoutes: RouteConfig, headerMenuItems: Array<string>) {
        this.manager = RouteManagerInterface.create(appRoutes, headerMenuItems);
    }
}
