import { urlParser, urlMapper } from '../utils';
import { RouteConfig } from './routes_config';

import { AUTHROUTES } from '../pages/auth/auth.routes.config';
import { APIROUTES } from '../pages/api/api.routes.config';


/**
 * High-level application routes.
 */
const APPROUTES: RouteConfig = {
    home: {
        url: '',
        name: 'home-view',
        menuTitle: 'Home',
        breadcrumb: false
    },
    about: {
        url: 'about',
        name: 'about-view',
        menuTitle: 'About'
    },
    demo: {
        url: 'test',
        name: 'demo-view',
        menuTitle: 'Components'
    },
    auth: {
        url: 'auth',
        children: AUTHROUTES
    },
    api: APIROUTES,
    default: {
        redirect: ''
    }
};

/**
 * Menu items that should appear on the left- and right-hand side of the header component.
 */
const MENU_LEFT = ['api-views', 'about-view', 'demo-view'];
const MENU_RIGHT = ['register-view', 'login-view', 'logout-view'];

/**
 * Parse route tree and find full frontend URL for each view.
 *
 * @param baseUrl Base URL for the URLs within the tree.
 * @param routeTree Application routes.
 *
 * @return Named views with corresponding URL.
 */
const routeParser = (baseUrl: string, routeTree: any, parent: any = null): any => {
    let urls = {};

    for (let key in routeTree) {
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
};

// Parse the routes and store corresponding frontend URLs and related data
const ROUTER_URLS = routeParser('/', APPROUTES);

/**
 * Interface for handling frontend URL resolving and related functionality.
 */
export class RouteManager {

    /**
     * Retrieve application routes.
     */
    static get ROUTES(): any {
        return APPROUTES;
    }

    /**
     * Retrieve route config.
     */
    static getConfig(viewName: string): any {
        return ROUTER_URLS[viewName];
    }

    /**
     * Resolve view name into frontend URL.
     *
     * @param name View name.
     * @param parameters URL parameters, if any.
     */
    static resolveByName(name: string, params?: any): string {
        return urlMapper(ROUTER_URLS[name].url, ROUTER_URLS[name].resolveData, params);
    }

    /**
     * Retrieve menu items for application main view.
     *
     * @param position Menu position of the items. Supported values:
     *   - left: retrieve items for left-hand side of the view
     *   - right: retrieve items for right-hand side of the view
     */
    static topMenuItems(position: string): Array<any> {
        const menuRef = (position === 'left') ? MENU_LEFT : (position === 'right') ? MENU_RIGHT : [];

        let data = [];
        for (let view of menuRef) {
            data.push(ROUTER_URLS[view]);
        }

        return data;
    }
}
