import { urlParser, urlMapper } from '../../utils';
import { RouteConfig } from '../model';

import { APPROUTES } from '../../pages/pages.routes.config';


/**
 * Menu items that should appear on the left-hand side of the header component.
 */
const MENU_LEFT = ['api-views', 'apps-view', 'about-view', 'demo-view'];

/**
 * Parse route tree and find full frontend URL for each view.
 *
 * @param baseUrl Base URL for the URLs within the tree.
 * @param routeTree Application routes.
 *
 * @return Named views with corresponding URL.
 */
function routeParser(baseUrl: string, routeTree: any, parent: any = null): any {
    let urls = {};

    for (const key in routeTree) {
        if (key && key !== 'default') {
            const route = routeTree[key];
            const url = baseUrl + route.url;

            if (route.name) {
                urls[route.name] = {
                    url: url,
                    route: route,
                    menuUrl: url.slice(1, url.length),
                    resolveData: urlParser(url),
                    parent: parent
                };
            }

            if (route.children) {
                const routes = routeParser(baseUrl + route.url + '/', route.children, urls[route.name]);
                urls = Object.assign(urls, routes);
            }
        }
    }

    return urls;
}

// Parse the routes and store corresponding frontend URLs and related data
const ROUTER_URLS = routeParser('/', APPROUTES);

/**
 * Interface for handling frontend URL resolving and related functionality.
 */
class RouteManagerInterface {
    constructor(protected appRoutes: RouteConfig, protected routerUrls: any) {}

    /**
     * Resolve view name into frontend URL.
     *
     * @param name View name.
     * @param parameters URL parameters, if any.
     */
    resolveByName(name: string, params?: any): string {
        return urlMapper(this.routerUrls[name].url, this.routerUrls[name].resolveData, params);
    }

    /**
     * Retrieve menu items for application main view.
     *
     * @param position Menu position of the items. Supported values:
     *   - left: retrieve items for left-hand side of the view
     */
    topMenuItems(position: string): Array<any> {
        const menuRef = (position === 'left') ? MENU_LEFT : [];

        const data = [];
        for (const view of menuRef) {
            data.push(this.routerUrls[view]);
        }

        return data;
    }
}

export const RouteManager = new RouteManagerInterface(APPROUTES, ROUTER_URLS);
