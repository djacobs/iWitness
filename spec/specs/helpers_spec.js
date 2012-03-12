describe("linkify helper", function() {
  var linkify, obj;
  beforeEach(function() {
    linkify = Ember.Handlebars.helpers.linkify;
    obj = Ember.Object.create();
  });

  it("does not include double quotes in the link text", function() {
    obj.set('text', "@SportsCenter: #Michigan players' tweets are possible violations http://t.co/wb4pTCTy\";; NONSENSE");
    expect(linkify.call(obj, "text").toString()).
      toEqual("@SportsCenter: #Michigan players&#x27; tweets are possible violations <a target=\"_blank\" href=\"http://t.co/wb4pTCTy\">http://t.co/wb4pTCTy</a>&quot;;; NONSENSE");
  });

  it("includes multiple links", function() {
    obj.set('text', "http://foo.com/a is short for http://bar.com/abc");
    expect(linkify.call(obj, "text").toString()).
      toEqual("<a target=\"_blank\" href=\"http://foo.com/a\">http://foo.com/a</a> is short for <a target=\"_blank\" href=\"http://bar.com/abc\">http://bar.com/abc</a>");
  });
});
