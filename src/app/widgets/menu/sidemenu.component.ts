import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, /*Params,*/ PRIMARY_OUTLET } from '@angular/router';

import { AppObservableArray /*, AppObservableArrayModes*/ } from '../base';


class MenuItemsObservable extends AppObservableArray<any> {}


@Component({
  selector: 'dng-sidemenu',
  templateUrl: './sidemenu.component.html'
})
export class SideMenuComponent {

    menuItems: MenuItemsObservable;

  constructor(router: Router, route: ActivatedRoute) {

    this.menuItems = new MenuItemsObservable();

      router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe(() => {
            const menuItems = [];
            const data = this.getParentRouteConfig(route.root);
            Object.keys(data).forEach((key) => {
                const item = data[key];

                console.log(item);
                menuItems.push({
                    title: item.menuTitle
                });
            });

            this.menuItems.addSubjects(menuItems);
        });
  }

  private getParentRouteConfig(route: ActivatedRoute) {

    let data = null;
    let children: ActivatedRoute[] = route.children;

    while (children.length !== 0) {
      for (let child of children) {
        // verify primary route
        if (child.outlet !== PRIMARY_OUTLET) {
          continue;
        }

        data = child.snapshot.data;
        children = child.children;
      }
    }

    console.log(data);
    return (data.config) ? data.config.route.children || {} : {};

    // return (data && data.config && data.config.parent) ? data.config.route.children : data.config.route.children || {};
  }
}
