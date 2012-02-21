describe("IWitness.ResultSetController", function() {
  var controller;
  beforeEach(function() {
    controller = IWitness.resultSetController;
  });
  afterEach(function() {
    controller.clearResults();
  });
  describe("sortedContent", function() {
    it("sorts results", function() {
      controller.pushResults("twitter", [
        makeTweet({created_at: "01/02/2012"}),
        makeTweet({created_at: "01/01/2012"}),
        makeTweet({created_at: "01/03/2012"})
      ]);
      var sorted = controller.get("sortedContent");
      expect(sorted.getEach("postedMoment").map(function(time) {
        return time.format("MM/DD/YYYY");
      })).toEqual(["01/03/2012", "01/02/2012", "01/01/2012"]);
    });
  });
});
