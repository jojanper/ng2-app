const AUTHROUTES = {
    register: {
        url: 'register',
        name: 'register-view'
    },
    login: {
        url: 'login',
        name: 'login-view'
    },
    logout: {
        url: 'logout',
        name: 'logout-view'
    }
};

const APPROUTES = {
    home: {
        url: 'home',
        name: 'home-view'
    },
    about: {
        url: 'about',
        name: 'about-view'
    },
    demo: {
        url: 'test',
        name: 'demo-view'
    },
    auth: {
        url: 'auth',
        children: AUTHROUTES
    },
    default: {
        redirect: 'home'
    }
};

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
                urls[route.name] = {
                    url: baseUrl + route.url
                };
            }
        }
    }

    return urls;
}

const ROUTER_URLS = routeParser('/', APPROUTES);


export class RouteManager {

    static get ROUTES(): any {
        return APPROUTES;
    }

    static resolveByName(name: string): string {
        return ROUTER_URLS[name].url;
    }
}
