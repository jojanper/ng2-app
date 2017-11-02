describe('App', function () {

    beforeEach(function () {
        browser.get('/');
    });

    it('should have a title', function () {
        expect(browser.getTitle()).toEqual("Draal App Playground using Angular");
    });

    it('should have header', function () {
        expect(element(by.css('dng-app dng-header')).isPresent()).toEqual(true);
    });

    it('should have <main>', function () {
        expect(element(by.css('dng-app main')).isPresent()).toEqual(true);
    });

    it('should have footer', function () {
        expect(element(by.css('dng-footer')).getText()).toEqual("Draal powered by Angular");
    });
});

describe('Login', function () {

    beforeEach(function () {
        browser.get('/#/auth/login');
    });

    it('should have sign-in form', function () {
        //element(by.buttonText('Sign in'));
        expect(element(by.css('dng-login h2')).getText()).toEqual('Sign In');
    });

    it('login should succeed', function () {
        //element(by.buttonText('Sign in'));
        //expect(element(by.css('dng-login h2')).getText()).toEqual('Sign In');

        const username = element(by.css('input[name=username]'));
        username.clear().sendKeys('test');

        const password = element(by.css('input[name=password]'));
        password.clear().sendKeys('password1');

        const submitButton = element(by.buttonText('Sign in'));
        submitButton.click();

        const home = element(by.css('dng-app dng-home'));
        expect(home.isPresent()).toEqual(true);
    });
});
