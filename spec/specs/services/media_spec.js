describe("TwitterHostedMedia", function() {
  var tweet, media;
  beforeEach(function(){
    tweet = {
      media_url: "https://p.twimg.com/AnSXE5FCEAAG5HJ.jpg",
      type: "photo",
      url: "pic.twitter.com/lmFTHAoZ"
    };
    media = IWitness.TwitterHostedMedia.create(tweet);
    Ember.run.sync();
  });

  describe("mediaUrl", function() {
    it("returns photo media url", function() {
      expect(media.get("mediaUrl")).toEqual("https://p.twimg.com/AnSXE5FCEAAG5HJ.jpg:small");
    });
  });

  describe("linkUrl", function() {
    it("returns permalink to media", function() {
      expect(media.get("linkUrl")).toEqual("pic.twitter.com/lmFTHAoZ");
    });
  });

  describe("isPhoto", function() {
    it("is true when type is photo",function(){
      expect(media.get("isPhoto")).toBeTruthy()
    });

    it("is false when type is not photo", function(){
      media.set("type", "video")
      expect(media.get("isPhoto")).toBeFalsy();
    });
  });
});

describe("TwitterLinkedMedia", function() {
  var tweet, media;

  beforeEach(function(){
    tweet = {expanded_url: "http://instagr.am/p/HxOi-1wLe_/"};
    media = IWitness.TwitterLinkedMedia.create(tweet);
    Ember.run.sync();
  });

  describe("link_url", function(){
    it("returns expanded_url", function() {
      expect(media.get("linkUrl")).toEqual(tweet.expanded_url);
    });
  });

  describe("instagram service", function() {
    it("is type picture", function() {
      expect(media.get("serviceType")).toEqual("picture");
    });
    it("has a mediaUrl", function() {
      expect(media.get("mediaUrl")).toEqual("http://instagr.am/p/HxOi-1wLe_/media/?size=m");
    });
  });

  describe("twitpic service", function() {
    beforeEach(function() {
      media.set("expanded_url", "http://twitpic.com/8s7vs5");
      Ember.run.sync()
    })
    it("is type picture", function() {
      expect(media.get("serviceType")).toEqual("picture");
    });
    it("has a mediaUrl", function() {
      expect(media.get("mediaUrl")).toEqual("http://twitpic.com/show/large/8s7vs5");
    });
  });

  describe("twitgoo service", function() {
    beforeEach(function() {
      media.set("expanded_url", "http://twitgoo.com/5prg5z");
      Ember.run.sync()
    })
    it("is type picture", function() {
      expect(media.get("serviceType")).toEqual("picture");
    });
    it("has a mediaUrl", function() {
      expect(media.get("mediaUrl")).toEqual("http://twitgoo.com/5prg5z/img");
    });
  });

  describe("lockerz service", function() {
    beforeEach(function() {
      media.set("expanded_url", "http://lockerz.com/s/204335287");
      Ember.run.sync()
    })
    it("is type picture", function() {
      expect(media.get("serviceType")).toEqual("picture");
    });
    it("has a mediaUrl", function() {
      expect(media.get("mediaUrl")).toEqual("http://api.plixi.com/api/tpapi.svc/imagefromurl?size=medium&url=http%3A%2F%2Flockerz.com%2Fs%2F204335287");
    });
  });

  xdescribe("yfrog service", function() {
    beforeEach(function() {
      media.set("expanded_url", "http://yfrog.com/neot4xj");
      Ember.run.sync()
    })
    it("is type picture", function() {
      expect(media.get("serviceType")).toEqual("picture");
    });
    it("has a mediaUrl", function() {
      expect(media.get("mediaUrl")).toEqual("http://yfrog.com/neot4xj:iphone");
    });
  });

  describe("youtube service full links", function() {
    beforeEach(function() {
      media.set("expanded_url", "http://youtube.com/watch?paramv=something&v=Da3WEEIeS-UQ&someotherparam");
      Ember.run.sync()
    })
    it("is type picture", function() {
      expect(media.get("serviceType")).toEqual("video");
    });
    it("has a mediaUrl", function() {
      expect(media.get("mediaUrl")).toEqual("http://www.youtube.com/embed/Da3WEEIeS-UQ");
    });
  });

  describe("youtube service short links", function() {
    beforeEach(function() {
      media.set("expanded_url", "http://youtu.be/Da3WEEIeSUQ");
      Ember.run.sync()
    })
    it("is type picture", function() {
      expect(media.get("serviceType")).toEqual("video");
    });
    it("has a mediaUrl", function() {
      expect(media.get("mediaUrl")).toEqual("http://www.youtube.com/embed/Da3WEEIeSUQ");
    });
  });

});
