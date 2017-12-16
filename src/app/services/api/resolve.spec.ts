import { ResolveUrl, CacheData } from './resolve';
import { ResponseFixtures } from '../../../test_helpers';


const msg = 'Unable to resolve /api/auth/account-activation/:activationkey: Key activationkey not present in input data';


describe('ResolveUrl', () => {
    it('returns undefined string for unresolved URL', () => {
        const cache = new CacheData();
        const resolver = new ResolveUrl(ResponseFixtures.root.data, cache);
        const response = resolver.getUrl('register');
        expect(response.url).toEqual(undefined);
    });

    it('fails when input parameters for URL are missing', () => {
        const cache = new CacheData();
        const resolver = new ResolveUrl(ResponseFixtures.root.data, cache);
        expect(() => resolver.getUrl('account-activation')).toThrowError(msg);
    });

    it('returns correct data for resolved URL', () => {
        const cache = new CacheData();
        const resolver = new ResolveUrl(ResponseFixtures.root.data, cache);
        const response = resolver.getUrl('account-activation', {activationkey: 1, foo: 'bar'});
        expect(response.url).toEqual('/api/auth/account-activation/1');
        expect(response.data).toEqual({foo: 'bar'});
    });

    it('supports cache', () => {
        const cache = new CacheData();
        const data = [{
            name: 'cache-url',
            url: 'test'
        }];

        const params = {foo: 'bar'};

        // Data is not in the cache at this point
        let resolver = new ResolveUrl(data, cache);
        let response = resolver.getUrl('cache-url', params);
        expect(response.url).toEqual('test');
        expect(response.data).toEqual(params);

        // Data should be loaded from cache now
        resolver = new ResolveUrl([], cache);
        response = resolver.getUrl('cache-url', params);
        expect(response.url).toEqual('test');
        expect(response.data).toEqual(params);

        // Return empty response if cache is cleared
        cache.clear();
        response = resolver.getUrl('cache-url');
        expect(response.url).toEqual(undefined);
    });
});
