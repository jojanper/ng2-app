import { RouteConfig } from '../../models';
import { RouteManagerInterface } from './manager';


const PREFIX = 'auth';
const MENU_LEFT = ['home-view'];

const APPROUTES: RouteConfig = [
    {
        url: '',
        name: 'home-view',
        menuTitle: 'Home',
        breadcrumb: false
    },
    {
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
            }
        ]
    }
];

describe('RouteManagerInterface', () => {
    let manager: RouteManagerInterface;

    beforeEach(() => {
        manager = RouteManagerInterface.create(APPROUTES, MENU_LEFT);
    });

    it('resolveByName', () => {
        expect(manager.resolveByName('home-view')).toEqual('/');
        expect(manager.resolveByName('auth.register-view')).toEqual('/auth/register');
        expect(manager.resolveByName('auth.login-view')).toEqual('/auth/login');
        expect(manager.resolveByName('auth.logout-view')).toEqual('/auth/logout');
        expect(manager.resolveByName('auth.account-activation-view', {'activationkey': 1}))
            .toEqual('/auth/activate/1');
    });

    it('topMenuItems', () => {
        expect(manager.topMenuItems('left').length).toBeGreaterThan(0);
        expect(manager.topMenuItems('right').length).toEqual(0);
        expect(manager.topMenuItems('side').length).toEqual(0);
    });
});
