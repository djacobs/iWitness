describe("IWitness.ResultView", function() {
  beforeEach(function() {
    result = Ember.Object.create({isTweet: true, contentText: "1st tweet"});
    view = IWitness.ResultView.create({model: result})
  });

  describe("contentText", function() {
    it("does not linkify non-links", function() {
      expect(view.get("contentText").toString()).toEqual("1st tweet");
    });

    it("linkifies links", function() {
      result.set('contentText', "Michigan players' tweets are possible violations http://t.co/wb4pTCTy\";; NONSENSE");
      expect(view.get("contentText").toString()).
        toEqual('Michigan players&#x27; tweets are possible violations <a target="_blank" href="http://t.co/wb4pTCTy">http://t.co/wb4pTCTy</a>&quot;;; NONSENSE');
    });

    it("linkifies multiple links", function() {
      result.set('contentText', "http://foo.com/a is short for http://bar.com/abc");
      expect(view.get("contentText").toString()).
        toEqual("<a target=\"_blank\" href=\"http://foo.com/a\">http://foo.com/a</a> is short for <a target=\"_blank\" href=\"http://bar.com/abc\">http://bar.com/abc</a>");
    });

    it("linkifies @mentions", function() {
      result.set("contentText", "@Lizzyuh I loved leveling as a healer! But I stopped after 80 cuz I heard it was harder :-(");
      expect(view.get("contentText").toString()).
        toEqual('<a href="http://twitter.com/Lizzyuh" target="_blank">@Lizzyuh</a> I loved leveling as a healer! But I stopped after 80 cuz I heard it was harder :-(');
    });

    it("linkifies #hashtags", function() {
      result.set("contentText", "RV runs out of gas in Columbus. I get a ticket.. #WTF");
      expect(view.get("contentText").toString()).
        toEqual('RV runs out of gas in Columbus. I get a ticket.. <a href="http://twitter.com/search?q=%23WTF" target="_blank">#WTF</a>');
    });

    it("all together now", function() {
      result.set('contentText', "Michigan players' tweets are possible violations http://t.co/wb4pTCTy\";; NONSENSE");
      expect(view.get("contentText").toString()).
        toEqual('Michigan players&#x27; tweets are possible violations <a target="_blank" href="http://t.co/wb4pTCTy">http://t.co/wb4pTCTy</a>&quot;;; NONSENSE');
    });
  });
});
