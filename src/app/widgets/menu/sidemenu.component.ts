import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, /*Params,*/ PRIMARY_OUTLET } from '@angular/router';

import { AppObservableArray /*, AppObservableArrayModes*/ } from '../base';


class MenuItemsObservable extends AppObservableArray<any> {}


@Component({
  selector: 'dng-sidemenu',
  templateUrl: './sidemenu.component.html'
})
export class SideMenuComponent implements OnInit {

    menuItems: MenuItemsObservable;

  constructor(router: Router, route: ActivatedRoute) {

    this.menuItems = new MenuItemsObservable();
    /*
    route.params
    .switchMap((params3: Params) => {
        console.log('HEP');
        console.log(params3);

        return '';
      // this.selectedId = +params['id'];
      // return this.service.getHeroes();
    });
    */

      router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe((params) => {
            console.log(params);
            /*
            console.log(router);
            console.log(route);
            console.log(route.snapshot.params);
            */

            console.log(route);
            console.log(route.snapshot);

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

            let root: ActivatedRoute = route.root;
            console.log(this.getBreadcrumbs(root));

            /*
            if (route.parent) {
                route.parent.params.subscribe((params) => {
                    //const url = urlPath[urlPath.length - 1].path;
                    console.log(params);
                    return;
                })
            }
            */
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

  private getBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs = []): Array<any> {
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
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }
      // console.log(child.snapshot.data);

      // get the route's URL segment
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      console.log(routeURL);

      // append route URL to URL
      url += `/${routeURL}`;

      // add breadcrumb
      /*
      let breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      breadcrumbs.push(breadcrumb);
      */

      const data = {
        params: child.snapshot.params,
        url: url,
        breadcrumb: child.snapshot.data.config.route.menuTitle,
      };
      breadcrumbs.push(data);
      // console.log(data);
      // console.log(child.snapshot.data);


      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
  }

  ngOnInit() {
  }
}
