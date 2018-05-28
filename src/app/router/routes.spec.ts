import { RouteManager } from './routes';


describe('RouteManager', () => {
    it('ROUTES', () => {
        expect(Object.keys(RouteManager.ROUTES).length).toBeGreaterThan(0);
    });

    it('resolveByName', () => {
        expect(RouteManager.resolveByName('home-view')).toEqual('/');
        expect(RouteManager.resolveByName('auth.register-view')).toEqual('/auth/register');
        expect(RouteManager.resolveByName('auth.login-view')).toEqual('/auth/login');
        expect(RouteManager.resolveByName('auth.logout-view')).toEqual('/auth/logout');
        expect(RouteManager.resolveByName('auth.account-activation-view', {'activationkey': 1}))
            .toEqual('/auth/activate/1');
    });

    it('topMenuItems', () => {
        expect(RouteManager.topMenuItems('left').length).toBeGreaterThan(0);
        expect(RouteManager.topMenuItems('right').length).toEqual(0);
        expect(RouteManager.topMenuItems('side').length).toEqual(0);
    });
});
