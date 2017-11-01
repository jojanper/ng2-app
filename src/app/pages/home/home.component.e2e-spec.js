describe('Home', function () {

  beforeEach(function () {
    browser.get('/');

    let username = element(by.css('input[name=username]'));
    username.clear().sendKeys('test');

    let password = element(by.css('input[name=password]'));
    password.clear().sendKeys('password1');

    let submitButton = element(by.buttonText('Sign in'));
    submitButton.click();
  });

  it('should have <dng-home>', function () {
    const home = element(by.css('dng-app dng-home'));
    expect(home.isPresent()).toEqual(true);
    expect(home.getText()).toEqual("Home Works!");
  });

});
