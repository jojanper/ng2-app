import { RouteManager } from './routes';


describe('RouteManager', () => {
    it('ROUTES', () => {
        expect(Object.keys(RouteManager.ROUTES).length).toBeGreaterThan(0);
    });

    it('resolveByName', () => {
        expect(RouteManager.resolveByName('home-view')).toEqual('/home');
        expect(RouteManager.resolveByName('register-view')).toEqual('/auth/register');
        expect(RouteManager.resolveByName('login-view')).toEqual('/auth/login');
        expect(RouteManager.resolveByName('logout-view')).toEqual('/auth/logout');
    });

    it('topMenuItems', () => {
        expect(RouteManager.topMenuItems('left').length).toBeGreaterThan(0);
        expect(RouteManager.topMenuItems('right').length).toBeGreaterThan(0);
        expect(RouteManager.topMenuItems('side').length).toEqual(0);
    });
});
