import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AppObservableArray } from '../../utils/base';


interface Breadcrumb {
    params: any;
    url: string;
    breadcrumb: string;
}

const ROUTE_DATA_CONFIG = 'config';

class MenuItemsObservable extends AppObservableArray<Breadcrumb> {}


@Component({
    selector: 'dng-breadcrumb',
    templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {

    menuItems: MenuItemsObservable;

    constructor(router: Router, route: ActivatedRoute) {
        this.menuItems = new MenuItemsObservable();

        // On each navigation end event, load and render new breadcrumbs
        router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => this.menuItems.addSubjects(this.getBreadcrumbs(route.root)));
    }

    private getBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs = [], prevBreadcrumb = ''): Array<Breadcrumb> {
        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            if (child.outlet !== PRIMARY_OUTLET) {
                continue;
            }

            const snapshot = child.snapshot;
            const data = snapshot.data;

            // Verify the custom data property is specified on the route
            if (!data.hasOwnProperty(ROUTE_DATA_CONFIG)) {
                return this.getBreadcrumbs(child, url, breadcrumbs, prevBreadcrumb);
            }

            const routeURL: string = snapshot.url.map(segment => segment.path).join('/');
            url += `/${routeURL}`;

            // Make sure route is not excluded from breadcrumb
            if (data.config.route.breadcrumb !== false) {
                let params = snapshot.params;
                let breadcrumb = data.config.route.menuTitle;

                // Show id as last item instead of the default route title
                if (snapshot.params.hasOwnProperty('id')) {
                    params = {};
                    breadcrumb = snapshot.params.id;
                }

                // Also make sure same breadcrumb is not included twice.
                // This may happen if route is lazy-loaded
                if (prevBreadcrumb !== breadcrumb) {
                    breadcrumbs.push({params, url, breadcrumb});
                }

                prevBreadcrumb = breadcrumb;
            }

            return this.getBreadcrumbs(child, url, breadcrumbs, prevBreadcrumb);
        }
    }
}
