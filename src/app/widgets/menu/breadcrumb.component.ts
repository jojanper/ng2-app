import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, /*Params,*/ PRIMARY_OUTLET } from '@angular/router';

import { AppObservableArray /*, AppObservableArrayModes*/ } from '../base';


class MenuItemsObservable extends AppObservableArray<any> {}


@Component({
  selector: 'dng-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {

  menuItems: MenuItemsObservable;

  constructor(router: Router, route: ActivatedRoute) {
    this.menuItems = new MenuItemsObservable();

      router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe(() => {
            const menuItems = this.getBreadcrumbs(route.root);
            this.menuItems.addSubjects(menuItems);
            console.log(menuItems);
        });
  }

  private getBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs = [], prevBreadcrumb = ''): Array<any> {
    // let prevBreadcrumb = '';

    const ROUTE_DATA_BREADCRUMB = 'config';

    // get the child routes
    let children: ActivatedRoute[] = route.children;

    // return if there are no more children
    // console.log(children);
    if (children.length === 0) {
      return breadcrumbs;
    }

    // iterate over each children
    for (let child of children) {
      // verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      console.log(child);

      // verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs, prevBreadcrumb);
      }
      // console.log(child.snapshot.data);

      // get the route's URL segment
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      console.log(routeURL);

      // append route URL to URL
      url += `/${routeURL}`;

      console.log(url);

      // add breadcrumb
      /*
      let breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      breadcrumbs.push(breadcrumb);
      */

      if (child.snapshot.data.config.route.breadcrumb !== false) {
        let params = child.snapshot.params;
        let breadcrumb = child.snapshot.data.config.route.menuTitle;
        if (child.snapshot.params.hasOwnProperty('id')) {
          breadcrumb = child.snapshot.params.id;
          params = {};
        }

        const data = {
          params,
          url,
          breadcrumb,
        };

        console.log(prevBreadcrumb + ' ' + data.breadcrumb);

        if (prevBreadcrumb !== data.breadcrumb) {
          console.log(data);
          breadcrumbs.push(data);
        }

        prevBreadcrumb = data.breadcrumb;
      }
      // console.log(data);
      // console.log(child.snapshot.data);


      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs, prevBreadcrumb);
    }
  }
}
