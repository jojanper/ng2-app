export interface RouteDetails {
    url?: string;
    name?: string;
    menuTitle?: string;
    sidemenu?: boolean;
    breadcrumb?: boolean;
    children?: RouteConfig;
    redirect?: string;
}

export interface RouteConfig extends Array<RouteDetails> {}
