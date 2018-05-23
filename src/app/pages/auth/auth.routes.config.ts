import { RouteConfig } from '../../router';

/**
 * Routes within authentication pages.
 */
export const AUTHROUTES: RouteConfig = {
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
    },
    'auth.pw-reset-request': {
        url: 'recover-account',
        name: 'auth.pw-reset-request-view',
        menuTitle: 'Request password reset'
    }
};
