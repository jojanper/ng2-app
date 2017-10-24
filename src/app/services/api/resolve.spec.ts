import { ResolveUrl, CacheData } from './resolve';
import { ResponseFixtures } from '../../../test_helpers';


describe('ResolveUrl', () => {
    it('returns empty string for unresolved URL', () => {
        const cache = new CacheData();
        const resolver = new ResolveUrl(ResponseFixtures.root.data, cache);
        expect(resolver.getUrl('register').length).toEqual(0);
    });

    it('supports cache', () => {
        const cache = new CacheData();
        const data = [{
            name: 'cache-url',
            url: 'test'
        }];

        // Data is not in the cache at this point
        let resolver = new ResolveUrl(data, cache);
        expect(resolver.getUrl('cache-url')).toEqual('test');

        // Data should be loaded from cache now
        resolver = new ResolveUrl([], cache);
        expect(resolver.getUrl('cache-url')).toEqual('test');

        // Return empty response if cache is cleared
        cache.clear();
        expect(resolver.getUrl('cache-url').length).toEqual(0);
    });
});
