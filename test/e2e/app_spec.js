describe('e2e feature', function() {
  it('test the feature', function() {
    browser.get('http://localhost:9000');
    expect(2+2).toEqual(4);
  });
});
