import { browser, by, element } from 'protractor';

describe('Home page', function () {
    beforeEach(function () {
        browser.get('/');
    });

    it('should have <dng-home> element', function () {
        const home = element(by.css('dng-app dng-home'));
        expect(home.isPresent()).toEqual(true);
        expect(home.getText()).toEqual('Home Works!');
    });
});
