describe("TwitterFilter", function() {
  var filter, params;

  describe("inTimeframe", function() {
    beforeEach(function() {
      params = {
        start:  "1/10/2012 10:00 +0000",
        end:    "1/10/2012 12:00 +0000",
        center: []
      };
      spyOn(Map, 'Box');
      filter = new TwitterFilter(params);
      spyOn(filter, 'hasGeo').andReturn(true);
    });

    it("returns tweets created between start and end", function() {
      var tweet = makeTweet({created_at: "Tue, 10 Jan 2012 11:36:17 +0000"});
      expect(filter.filter([tweet])).toEqual([tweet]);
    });

    it("does not return tweets created before the start", function() {
      var tweet = makeTweet({created_at: "Tue, 10 Jan 2012 09:36:17 +0000"});
      expect(filter.filter([tweet])).toEqual([]);
    });

    it("does not return tweets created after the end", function() {
      var tweet = makeTweet({created_at: "Tue, 10 Jan 2012 12:36:17 +0000"});
      expect(filter.filter([tweet])).toEqual([]);
    });
  });

  describe("inGeo", function() {
    it("omits results that are not geocoded", function(){
    });
    it("omits results that are geocoded outside the map area", function(){
    });
    it("includes results are geocoded in the map area", function(){
    });
  });
});

