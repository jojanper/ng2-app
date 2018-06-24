export interface UrlParserData {
    [name: string]: string;
}

export function urlParser(url: string): UrlParserData {
    const matches = url.match(/:[^\s/]+/g) || [];

    const mapData: UrlParserData = {};
    matches.forEach((match) => {
        mapData[match] = match.slice(1, match.length);
    });

    return mapData;
}

export function urlMapper(url: string, resolveMap: UrlParserData, resolveData: any): string {
    Object.keys(resolveMap).forEach((key) => {
        const value = resolveMap[key];
        const target = (resolveData) ? resolveData[value] : null;
        if (!target) {
            throw new Error(`Unable to resolve ${url}: Key ${value} not present in input data`);
        }
        url = url.replace(key, target);
    });

    return url;
}

/**
 * Parse route tree and find full frontend URL for each view.
 *
 * @param baseUrl Base URL for the URLs within the tree.
 * @param routeTree Application routes.
 *
 * @return Named views with corresponding URL.
 */
export function routeParser(baseUrl: string, routeTree: any, parent: any = null): any {
    let urls = {};

    routeTree.forEach((route) => {
        // Skip default route
        if (route.hasOwnProperty('redirect')) {
            return;
        }

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
    });

    return urls;
}
