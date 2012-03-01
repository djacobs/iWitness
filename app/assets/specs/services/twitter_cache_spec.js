describe("TwitterCache", function() {
  beforeEach(function() {
    localStorage.clear();
  });

  describe("storeTweet", function() {
    it("stores in localStorage", function() {
      TwitterCache.storeTweet('test', moment());
      expect(localStorage.length).toEqual(1);
    });

    it("doesn't store multiple entries for very close times", function() {
      TwitterCache.storeTweet('test', moment("2/12/12 12:00:00"));
      TwitterCache.storeTweet('another test', moment("2/12/12 12:00:05"));
      expect(localStorage.length).toEqual(1);
    });
  });

  describe("getClosestTweetId", function() {
    it("returns the id for the closest timestamp", function() {
      var target   = moment("02/12/12 17:00 +0000");
      var closest  = moment("02/12/12 18:00 +0000");
      var farthest = moment("02/12/12 19:00 +0000");

      TwitterCache.storeTweet('closest_id', closest);
      TwitterCache.storeTweet('farthest_id', farthest);

      expect(TwitterCache.getClosestTweetId(target)).toEqual('closest_id');
    });

    it("does not return earlier timestamps", function() {
      var target   = moment("02/12/12 17:00 +0000");
      var earlier  = moment("02/12/12 16:00 +0000");

      TwitterCache.storeTweet('earlier_id', earlier);

      expect(TwitterCache.getClosestTweetId(target)).toBeNull();
    });

    it("does not return timestamps for another day", function() {
      var target   = moment("02/12/12 17:00 +0000");
      var anotherDay  = moment("02/13/12 01:00 +0000");

      TwitterCache.storeTweet('another_day_id', anotherDay);

      expect(TwitterCache.getClosestTweetId(target)).toBeNull();
    });
  });
});
