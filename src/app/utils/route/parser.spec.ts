import { urlParser, urlMapper, UrlParserData } from './parser';


describe('urlParser', () => {
    it('succeeds to parse URL string', () => {
        const response = urlParser('/data/test/:testid/:key');
        expect(response).toEqual({
            ':testid': 'testid',
            ':key': 'key'
        } as any);
    });
});

describe('urlMapper', () => {
    const resolveMap = {':testid': 'testid'} as UrlParserData;

    it('fails when missing data is encountered', () => {
        expect(() => urlMapper('/data/test/:testid', resolveMap, null))
            .toThrowError('Unable to resolve /data/test/:testid: Key testid not present in input data');
    });

    it('succeeds', () => {
        expect(urlMapper('/data/test/:testid', resolveMap, {testid: 1})).toEqual('/data/test/1');
    });
});

