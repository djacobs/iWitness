describe("TwitterSearch", function() {
  var search, params;

  describe("inTimeframe", function() {
    beforeEach(function() {
      params = {
        start:  "1/10/2012 10:00 +0000",
        end:    "1/10/2012 12:00 +0000",
        center: [],
      };
      spyOn(Map, 'Box');
      search = new TwitterSearch(params);
    });

    it("returns true for times between start and end", function() {
      expect(search.inTimeframe({created_at: "Tue, 10 Jan 2012 11:36:17 +0000"})).toBeTruthy();
    });

    it("returns false for times before the start", function() {
      expect(search.inTimeframe({created_at: "Tue, 10 Jan 2012 09:36:17 +0000"})).toBeFalsy();
    });

    it("returns false for times after the end", function() {
      expect(search.inTimeframe({created_at: "Tue, 10 Jan 2012 12:36:17 +0000"})).toBeFalsy();
    });
  });
});

