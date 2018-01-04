import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, /*Params,*/ PRIMARY_OUTLET } from '@angular/router';

import { AppEventsService, AppEventTypes } from '../../services';
import { AppObservableArray /*, AppObservableArrayModes*/ } from '../base';


class MenuItemsObservable extends AppObservableArray<any> {}


// https://github.com/angular/angular/issues/9496
// https://stackoverflow.com/questions/38475342/mocking-router-events-subscribe-angular2

@Component({
  selector: 'dng-sidemenu',
  templateUrl: './sidemenu.component.html'
})
export class SideMenuComponent {

    menuItems: MenuItemsObservable;

  constructor(router: Router, route: ActivatedRoute, appEvents: AppEventsService) {

    this.menuItems = new MenuItemsObservable();

      router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe(() => {
            const menuItems = [];
            const data = this.getParentRouteConfig(route.root);
            console.log('DATA');
            console.log(data);
            Object.keys(data.links).forEach((key) => {
                const item = data.links[key];

                console.log('ITEM');
                console.log(item);
                if (item.breadcrumb !== false) {
                    menuItems.push({
                        title: item.menuTitle,
                        url: `${data.url}/${item.url}`
                    });
                }
            });

            console.log(menuItems);

            this.menuItems.addSubjects(menuItems);
            appEvents.sendEvent(AppEventTypes.SIDEMENU, {menuItems});
        });
  }

  private getParentRouteConfig(route: ActivatedRoute) {

    let url = '';

    let data = null;
    let children: ActivatedRoute[] = route.children;

    while (children.length !== 0) {
      for (let child of children) {
        // verify primary route
        if (child.outlet !== PRIMARY_OUTLET) {
          continue;
        }

        const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
        url += `/${routeURL}`;

        data = child.snapshot.data;
        children = child.children;
        console.log(child);
      }
    }

    console.log(data);
    console.log(url);
    const links = (data.config) ? data.config.route.children || {} : {};

    return {
      url,
      links
    };

    // return (data && data.config && data.config.parent) ? data.config.route.children : data.config.route.children || {};
  }
}
