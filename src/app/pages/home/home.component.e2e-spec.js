describe('Home page', function () {
    beforeEach(function () {
        browser.get('/#/home');
    });

    it('should have <dng-home> element', function () {
        const home = element(by.css('dng-app dng-home'));
        expect(home.isPresent()).toEqual(true);
        expect(home.getText()).toEqual("Home Works!");
    });
});
