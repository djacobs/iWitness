describe("IWitness.ResultSetController", function() {
  var controller;
  beforeEach(function() {
    controller = IWitness.resultSetController;
    controller.resume();
  });
  afterEach(function() {
    controller.clearResults();
    controller.resume();
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

    it("does not insert duplicate results", function(){
      controller.pushResults("twitter", [makeTweet({id_str: "123"})]);
      controller.pushResults("twitter", [makeTweet({id_str: "123"})]);
      expect(controller.get("length")).toEqual(1);
    });

    it("does not insert results if stopped", function(){
      controller.clearResults();
      // don't resume
      controller.pushResults("twitter", [makeTweet({id_str: "123"})]);
      expect(controller.get("length")).toEqual(0);

      controller.resume();
      controller.pushResults("twitter", [makeTweet({id_str: "123"})]);
      expect(controller.get("length")).toEqual(1);
    });
  });

  describe("filtered", function() {
    beforeEach(function() {
      var types = IWitness.filter.get("availableMediaTypes");
      types.forEach(function(type) {
        if (type.get("type") == "text") type.set("active", true);
        if (type.get("type") == "picture") type.set("active", false);
      });
    });

    it("includes media types matching the filter", function(){
      var text = Ember.Object.create({mediaTypes: ['text']});
      controller.pushObject(text);
      expect(controller.get("filtered")).toContain(text);
    });

    it("excludes media types not matching the filter", function(){
      var pic = Ember.Object.create({mediaTypes: ['picture']});
      controller.pushObject(pic);
      expect(controller.get("filtered")).not.toContain(pic);
    });

    it("includes media types that match any filter", function(){
      var multi = Ember.Object.create({mediaTypes: ['text', 'picture']});
      controller.pushObject(multi);
      expect(controller.get("filtered")).toContain(multi);
    });
  });

});
