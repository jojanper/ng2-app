import { RouteConfig } from '../../models';

import { urlMapper, routeParser } from './parser';


/**
 * Interface for handling frontend URL resolving and related functionality.
 */
export class RouteManagerInterface {
    static create(appRoutes: RouteConfig, headerMenuItems: Array<string>) {
        return new RouteManagerInterface(routeParser('/', appRoutes), appRoutes, headerMenuItems);
    }

    constructor(
        protected appRoutes: RouteConfig, protected routerUrls: any,
        protected headerMenuItems: Array<string>
    ) {}

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
        const menuRef = (position === 'left') ? this.headerMenuItems : [];

        const data = [];
        for (const view of menuRef) {
            data.push(this.routerUrls[view]);
        }

        return data;
    }
}
