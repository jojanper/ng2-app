import { Injectable } from '@angular/core';
import { Router, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Injectable()
export class RouterService {
    constructor(router: Router) {
        router.events.pipe(
            filter(event => event instanceof RouteConfigLoadEnd)
        ).subscribe((data) => {
            console.log(data);
        });
    }
}
