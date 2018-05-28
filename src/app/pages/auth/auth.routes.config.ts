import { RouteConfig } from '../../router';

const PREFIX = 'auth';

/**
 * Routes within authentication pages.
 */
export const AUTHROUTES: RouteConfig = {
    'auth.register': {
        url: 'register',
        name: `${PREFIX}.register-view`,
        menuTitle: 'Sign up'
    },
    'auth.login': {
        url: 'login',
        name: `${PREFIX}.login-view`,
        menuTitle: 'Sign in'
    },
    'auth.logout': {
        url: 'logout',
        name: `${PREFIX}.logout-view`,
        menuTitle: 'Sign out'
    },
    'auth.activate': {
        url: 'activate/:activationkey',
        name: `${PREFIX}.account-activation-view`,
        menuTitle: 'Activate account'
    },
    'auth.pw-reset-request': {
        url: 'recover-account',
        name: `${PREFIX}.pw-reset-request-view`,
        menuTitle: 'Request password reset'
    }
};
