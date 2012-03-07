describe("TwitterResult", function() {
  var result, entities;
  describe("contentSrc", function() {
    beforeEach(function() {
      entities = {urls: []};
      result = IWitness.TwitterResult.create({entities: entities});
    });

    it("returns null when no entities", function() {
      expect(result.get("contentSrc")).toBeNull();
    });

    it("returns an instagram url", function() {
      entities.urls.push({expanded_url: "http://instagr.am/p/aasdfASDFSD/"});
      expect(result.get("contentSrc")).toEqual("http://instagr.am/p/aasdfASDFSD/media/?size=m");
    });
  });
});
