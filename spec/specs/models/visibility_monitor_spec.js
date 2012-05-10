describe("IWitness.VisibilityMonitor", function() {
  var monitor, result;
  beforeEach(function() {
    IWitness.hiddenItemsController.pause();
    result = Ember.Object.create({mediaTypes: ["text"]})
    monitor = IWitness.VisibilityMonitor.create({result: result});
    var types = IWitness.filter.get("availableMediaTypes");
    types.forEach(function(type) {
      if (type.get("type") == "text") type.set("active", true);
      if (type.get("type") == "picture") type.set("active", false);
    });
  });

  describe("scroll pause (holding filters constant)", function() {
    it("is hidden when currently paused", function() {
      expect(monitor.get("isVisible")).toBeFalsy();
    });

    it("becomes visible when unpaused", function() {
      IWitness.hiddenItemsController.unpause();
      expect(monitor.get("isVisible")).toBeTruthy();
    });
  });

  describe("not scroll-paused", function() {
    it("is visible immediately", function() {
      IWitness.hiddenItemsController.unpause();
      monitor = IWitness.VisibilityMonitor.create({result: result});
      expect(monitor.get("isVisible")).toBeTruthy();
    })
  })

  describe("filtering (holding scroll-pause constant)", function() {
    beforeEach(function() {
      IWitness.hiddenItemsController.unpause();
    });

    it("includes media types matching the filter", function(){
      result.set("mediaTypes", ["text"]);
      expect(monitor.get("isVisible")).toBeTruthy();
    });

    it("excludes media types not matching the filter", function(){
      result.set("mediaTypes", ["picture"]);
      expect(monitor.get("isVisible")).toBeFalsy();
    });

    it("includes media types that match any filter", function(){
      result.set("mediaTypes", ["text", "picture"]);
      expect(monitor.get("isVisible")).toBeTruthy();
    });
  });
});
