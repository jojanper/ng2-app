import { RouteConfig } from '../models';

import { AUTHROUTES } from './auth/auth.routes.config';
import { APIROUTES } from './api/api.routes.config';
import { APPSROUTES } from './apps/apps.routes.config';


const ROUTES: RouteConfig = [
    {
        url: '',
        name: 'home-view',
        menuTitle: 'Home',
        breadcrumb: false
    },
    {
        url: 'about',
        name: 'about-view',
        menuTitle: 'About'
    },
    {
        url: 'test',
        name: 'demo-view',
        menuTitle: 'Components'
    },
    APIROUTES,
    APPSROUTES,
    AUTHROUTES,
    {
        redirect: ''
    }
];

/**
 * High-level application routes.
 */
export const APPROUTES = ROUTES;
