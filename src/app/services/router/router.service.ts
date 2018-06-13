import { Injectable } from '@angular/core';
import { Router, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { RouteManager } from '../../router/manager';


@Injectable()
export class RouterService {
    constructor(router: Router) {
        router.events.pipe(
            filter(event => event instanceof RouteConfigLoadEnd)
        ).subscribe((data) => {
            console.log(data);
        });
    }

    resolveByName(name: string, params?: any): string {
        return RouteManager.resolveByName(name, params);
    }

    setIntialRoutes() {

    }
}
