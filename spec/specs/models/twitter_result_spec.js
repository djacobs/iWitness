describe("TwitterResult", function() {
  var result, entities;
  describe("contentSrc", function() {
    beforeEach(function() {
      entities = {urls: []};
      result = IWitness.TwitterResult.create({entities: entities});
    });

    describe("picture services", function() {
      it("returns nothing when no entities", function() {
        expect(result.get("contentSrc")).toBeFalsy();
      });

      it("returns an instagram url", function() {
        entities.urls.push({expanded_url: "http://instagr.am/p/HxOi-1wLe_/"});
        expect(result.get("contentSrc")).toEqual("http://instagr.am/p/HxOi-1wLe_/media/?size=m");
      });

      it("returns a twitpic url", function() {
        entities.urls.push({expanded_url: "http://twitpic.com/8s7vs5"});
        expect(result.get("contentSrc")).toEqual("http://twitpic.com/show/large/8s7vs5");
      });

      it("returns a twitgoo url", function() {
        entities.urls.push({expanded_url: "http://twitgoo.com/5prg5z"});
        expect(result.get("contentSrc")).toEqual("http://twitgoo.com/5prg5z/img");
      });

      it("returns a lockerz url", function() {
        entities.urls.push({expanded_url: "http://lockerz.com/s/204335287"});
        expect(result.get("contentSrc")).toEqual("http://api.plixi.com/api/tpapi.svc/imagefromurl?size=medium&url=http%3A%2F%2Flockerz.com%2Fs%2F204335287");
      });

      xit("returns a yfrog url", function() {
        entities.urls.push({expanded_url: "http://yfrog.com/neot4xj" });
        expect(result.get("contentSrc")).toEqual("http://yfrog.com/neot4xj:iphone");
      });
    });

    describe("video services", function(){
      it("returns a youtube url", function() {
        entities.urls.push({expanded_url: "http://youtube.com/watch?paramv=something&v=Da3WEEIeS-UQ&someotherparam" });
        expect(result.get("contentSrc")).toEqual("http://www.youtube.com/embed/Da3WEEIeS-UQ");
      });

      it("returns a youtube url (short link)", function() {
        entities.urls.push({expanded_url: "http://youtu.be/Da3WEEIeSUQ" });
        expect(result.get("contentSrc")).toEqual("http://www.youtube.com/embed/Da3WEEIeSUQ");
      });
    });

    describe("twitter media links", function() {
      it("returns photo media url", function() {
        entities.media = [{media_url: "https://p.twimg.com/AnSXE5FCEAAG5HJ.jpg", type: "photo"}]
        expect(result.get("contentSrc")).toEqual("https://p.twimg.com/AnSXE5FCEAAG5HJ.jpg:small");
      });

      it("does not return non-photo media", function() {
        entities.media = [{media_url: "https://p.twimg.com/AnSXE5FCEAAG5HJ.mov", type: "vid"}]
        expect(result.get("contentSrc")).toBeFalsy();
      });
    });
  });

  describe("contentLink", function() {
    var result, entities;

    beforeEach(function() {
      entities = {urls: []};
      result = IWitness.TwitterResult.create({entities: entities});
    });

    it("returns an instagram url", function() {
      entities.urls.push({expanded_url: "http://instagr.am/p/HxOi-1wLe_/"});
      expect(result.get("contentLink")).toEqual("http://instagr.am/p/HxOi-1wLe_/");
    });

    it("returns a twitpic url", function() {
      entities.urls.push({expanded_url: "http://twitpic.com/8s7vs5"});
      expect(result.get("contentLink")).toEqual("http://twitpic.com/8s7vs5");
    });

    it("returns photo media url", function() {
      entities.media = [{media_url: "https://p.twimg.com/AnSXE5FCEAAG5HJ.jpg", type: "photo", url: "pic.twitter.com/lmFTHAoZ"}]
      expect(result.get("contentLink")).toEqual("pic.twitter.com/lmFTHAoZ");
    });
  });
});
