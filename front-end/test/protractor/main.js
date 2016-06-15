describe('bypath main map', function() {
  it('should load up the main screen', function() {
    browser.get('http://localhost:3000');
    var navigateButton = element.all(by.className('ion-ios-navigate'));
    expect(navigateButton.count()).toEqual(1);
  });
});
