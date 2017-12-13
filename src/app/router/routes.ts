import { urlParser, urlMapper } from '../utils';

/**
 * Routes within authentication pages
 */
const AUTHROUTES = {
    register: {
        url: 'register',
        name: 'register-view',
        menuTitle: 'Sign up'
    },
    login: {
        url: 'login',
        name: 'login-view',
        menuTitle: 'Sign in'
    },
    logout: {
        url: 'logout',
        name: 'logout-view',
        menuTitle: 'Sign out'
    },
    activate: {
        url: 'activate/:activationkey',
        name: 'account-activation-view',
        menuTitle: 'Activate account'
    }
};

/**
 * Application routes.
 */
const APPROUTES = {
    home: {
        url: 'home',
        name: 'home-view',
        menuTitle: 'Home'
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
    planets: {
        url: 'planets',
        name: 'planets-view',
        menuTitle: 'Planets'
    },
    default: {
        redirect: 'home'
    }
};

/**
 * Menu items that should appear on the left- and right-hand side of the header component.
 */
const MENU_LEFT = ['home-view', 'planets-view', 'about-view', 'demo-view'];
const MENU_RIGHT = ['register-view', 'login-view', 'logout-view'];

/**
 * Parse route tree and find full frontend URL for each view.
 *
 * @param baseUrl Base URL for the URLs within the tree.
 * @param routeTree Application routes.
 *
 * @return Named views with corresponding URL.
 */
const routeParser = (baseUrl: string, routeTree: any): any => {
    let urls = {};

    for (let key in routeTree) {
        if (key && key !== 'default') {
            const route = routeTree[key];
            if (route.children) {
                urls = Object.assign(urls, routeParser(baseUrl + route.url + '/', route.children));
            } else {
                const url = baseUrl + route.url;

                urls[route.name] = {
                    url: url,
                    route: route,
                    menuUrl: url.slice(1, url.length),
                    resolveData: urlParser(url)
                };
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
export class RouteManager {

    /**
     * Retrieve application routes.
     */
    static get ROUTES(): any {
        return APPROUTES;
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
