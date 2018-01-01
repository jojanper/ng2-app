import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params, PRIMARY_OUTLET } from "@angular/router";

@Component({
  selector: 'dng-sidemenu',
  templateUrl: './sidemenu.component.html'
})
export class SideMenuComponent implements OnInit {

  constructor(router: Router, route: ActivatedRoute) {
    route.params
    .switchMap((params3: Params) => {
        console.log('HEP');
        console.log(params3);

        return '';
      //this.selectedId = +params['id'];
      //return this.service.getHeroes();
    });

      router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe((params) => {
            console.log(params);
            /*
            console.log(router);
            console.log(route);
            console.log(route.snapshot.params);
            */

            console.log(route.snapshot.params);

            let root: ActivatedRoute = route.root;
            this.getBreadcrumbs(root);

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

  private getBreadcrumbs(route: ActivatedRoute, url: string=""): void {
    //const ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

    //get the child routes
    let children: ActivatedRoute[] = route.children;

    //return if there are no more children
    //console.log(children);
    if (children.length === 0) {
      return;
    }

    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      //verify the custom data property "breadcrumb" is specified on the route
      /*
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url);
      }
      */
      console.log(child.snapshot.data);

      //get the route's URL segment
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");

      //append route URL to URL
      url += `/${routeURL}`;

      //add breadcrumb
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
        url: url
      };
      console.log(data);

      //recursive
      return this.getBreadcrumbs(child, url);
    }
  }

  ngOnInit() {
  }
}
