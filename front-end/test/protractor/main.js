describe('bypath main map', function() {
  it('should load up the main screen', function() {
    browser.get('http://localhost:3000');
    var navigateIcon = element.all(by.className('ion-ios-navigate'));
    expect(navigateIcon.count()).toEqual(1);
  });

  it('there are a bunch of leaflet markers, too', function () {
    browser.wait(function () {
      return element(by.className('leaflet-marker-icon')).isPresent();
    }, 10000);
    var leafletIcons = element.all(by.className('leaflet-marker-icon'));
    expect(leafletIcons.count()).toBeGreaterThan(3);
  })
});
