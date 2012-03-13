describe("TwitterTimestampCache", function() {
  beforeEach(function() {
    localStorage.clear();
  });

  describe("storeTweet", function() {
    it("stores in localStorage", function() {
      TwitterTimestampCache.storeTweet('test', moment());
      expect(localStorage.length).toEqual(1);
    });

    it("doesn't store multiple entries for very close times", function() {
      TwitterTimestampCache.storeTweet('test', moment("2/12/12 12:00:00"));
      TwitterTimestampCache.storeTweet('another test', moment("2/12/12 12:00:05"));
      expect(localStorage.length).toEqual(1);
    });
  });

  describe("getClosestTweetId", function() {
    it("returns the id for the closest timestamp", function() {
      var target   = moment("02/12/12 17:00 +0000");
      var closest  = moment("02/12/12 18:00 +0000");
      var farthest = moment("02/12/12 19:00 +0000");

      TwitterTimestampCache.storeTweet('closest_id', closest);
      TwitterTimestampCache.storeTweet('farthest_id', farthest);

      expect(TwitterTimestampCache.getClosestTweetId(target)).toEqual('closest_id');
    });

    it("does not return earlier timestamps", function() {
      var target   = moment("02/12/12 17:00 +0000");
      var earlier  = moment("02/12/12 16:00 +0000");

      TwitterTimestampCache.storeTweet('earlier_id', earlier);

      expect(TwitterTimestampCache.getClosestTweetId(target)).toBeNull();
    });

    it("does not return timestamps for another day", function() {
      var target   = moment("02/12/12 17:00 +0000");
      var anotherDay  = moment("02/13/12 01:00 +0000");

      TwitterTimestampCache.storeTweet('another_day_id', anotherDay);

      expect(TwitterTimestampCache.getClosestTweetId(target)).toBeNull();
    });
  });

  describe("expire", function() {
    it("deletes tweets older than 9 days", function() {
      var too_old = moment().subtract('days', 9).subtract('hours', 1);
      var recent  = moment().subtract('days', 9).add('hours', 1);

      TwitterTimestampCache.storeTweet('too_old', too_old);
      TwitterTimestampCache.storeTweet('recent', recent);
      TwitterTimestampCache.expire();

      expect(localStorage.length).toEqual(1);
      for (var key in localStorage) {
        expect(localStorage[key]).toEqual('recent');
      }
    });

    it("should not delete other local storage items", function(){
      localStorage['10160491'] = "some unrelated item"
      TwitterTimestampCache.expire();
      expect(localStorage.length).toEqual(1);
    });
  });
});
