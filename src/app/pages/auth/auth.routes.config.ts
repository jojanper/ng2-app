import { RouteDetails } from '../../models';

const PREFIX = 'auth';


/**
 * Routes within authentication pages.
 */
export const AUTHROUTES: RouteDetails = {
    url: 'auth',
    children: [
        {
            url: 'register',
            name: `${PREFIX}.register-view`,
            menuTitle: 'Sign up'
        },
        {
            url: 'login',
            name: `${PREFIX}.login-view`,
            menuTitle: 'Sign in'
        },
        {
            url: 'logout',
            name: `${PREFIX}.logout-view`,
            menuTitle: 'Sign out'
        },
        {
            url: 'activate/:activationkey',
            name: `${PREFIX}.account-activation-view`,
            menuTitle: 'Activate account'
        },
        {
            url: 'recover-account',
            name: `${PREFIX}.pw-reset-request-view`,
            menuTitle: 'Request password reset'
        }
    ]
};
