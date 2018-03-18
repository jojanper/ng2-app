import { AppCookie } from './cookie';
import { TestServiceHelper } from '../../test_helpers';


describe('AppCookie', () => {
    const mock = new TestServiceHelper.CookieService();
    const obj = new AppCookie(mock.getService());

    it('set string cookie', () => {
        obj.setCookie('key', 'value');
        expect(obj.getCookie('key')).toEqual('value');
    });

    it('set object cookie', () => {
        const value = {foo: 'bar'};
        obj.setCookie('object-key', value);
        expect(obj.getCookieObject('object-key')).toEqual(value);
    });

    it('clear cookies', () => {
        obj.clear();
        expect(Object.keys(mock.cookieValues).length).toEqual(0);
    });
});
