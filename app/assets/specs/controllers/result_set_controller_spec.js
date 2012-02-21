describe("IWitness.ResultSetController", function() {
  var controller;
  beforeEach(function() {
    controller = IWitness.resultSetController;
  });
  afterEach(function() {
    controller.clearResults();
  });
  describe("pushResults", function() {
    it("sorts results", function() {
      controller.pushResults("twitter", [
        makeTweet({created_at: "01/02/2012"}),
        makeTweet({created_at: "01/01/2012"}),
        makeTweet({created_at: "01/03/2012"})
      ]);
      expect(controller.getEach("postedMoment").map(function(time) {
        return time.format("MM/DD/YYYY");
      })).toEqual(["01/03/2012", "01/02/2012", "01/01/2012"]);
    });

    it("sorts results when inserted one at a time", function() {
      controller.pushResults("twitter", [makeTweet({created_at: "01/02/2012"})]);
      controller.pushResults("twitter", [makeTweet({created_at: "01/01/2012"})]);
      controller.pushResults("twitter", [makeTweet({created_at: "01/03/2012"})]);
      expect(controller.getEach("postedMoment").map(function(time) {
        return time.format("MM/DD/YYYY");
      })).toEqual(["01/03/2012", "01/02/2012", "01/01/2012"]);
    });
  });
});
