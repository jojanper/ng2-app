import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';

import { AppEventsService, AppEventTypes } from '../../services';
import { AppObservableArray } from '../base';
import { RouteConfig } from '../../router';

interface SideMenuItem {
    title: string;
    url: string;
}

interface SideMenuRouteConfig {
    url: string;
    links: RouteConfig;
}

class SideMenuItemsObservable extends AppObservableArray<SideMenuItem> {}


@Component({
  selector: 'dng-sidemenu',
  templateUrl: './sidemenu.component.html'
})
export class SideMenuComponent {

    menuItems: SideMenuItemsObservable;

    constructor(router: Router, route: ActivatedRoute, appEvents: AppEventsService) {

        this.menuItems = new SideMenuItemsObservable();

        // Reload menu links on every navigation end event
        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(() => {
                // Get the menu links, if any
                const menuItems = this.getMenuItems(this.getRouteConfig(route.root));
                this.menuItems.addSubjects(menuItems);

                // Send sidemenu event
                appEvents.sendEvent(AppEventTypes.SIDEMENU, {menuItems});
            });
    }

    private getMenuItems(data: SideMenuRouteConfig): Array<SideMenuItem> {
        const menuItems = [];

        Object.keys(data.links).forEach((key) => {
            const item = data.links[key];
            if (item.sidemenu !== false) {
                menuItems.push({
                    title: item.menuTitle,
                    url: `${data.url}/${item.url}`
                });
            }
        });

        return menuItems;
    }

    private getRouteConfig(route: ActivatedRoute): SideMenuRouteConfig {
        let url = '';
        let data = null;
        let children: ActivatedRoute[] = route.children;

        while (children.length !== 0) {
            for (let child of children) {
                // Verify primary route
                if (child.outlet !== PRIMARY_OUTLET) {
                    continue;
                }

                const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
                url += `/${routeURL}`;

                data = child.snapshot.data;
                children = child.children;
            }
        }

        const links = (data.config) ? data.config.route.children || {} : {};

        return {url, links};
    }
}
