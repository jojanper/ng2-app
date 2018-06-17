import { RouteConfig } from '../models';

import { AUTHROUTES } from './auth/auth.routes.config';
import { APIROUTES } from './api/api.routes.config';
import { APPSROUTES } from './apps/apps.routes.config';


/**
 * High-level application routes.
 */
export const APPROUTES: RouteConfig = {
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
    apps: APPSROUTES,
    auth: AUTHROUTES,
    api: APIROUTES,
    default: {
        redirect: ''
    }
};
