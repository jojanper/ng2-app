import { ResolveUrl } from './resolve';
import { ResponseFixtures } from '../../../test_helpers';


const resolver = new ResolveUrl(ResponseFixtures.root.data);


describe('ResolveUrl', () => {
    it('resolver returns empty string for unresolved URL', () => {
        expect(resolver.getUrl('register').length).toEqual(0);
    });
});
