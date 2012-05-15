describe("IWitness.VisibilityMonitor", function() {
  var monitor, result, twitterService;
  beforeEach(function() {
    IWitness.hiddenItemsController.unpause();
    result = Ember.Object.create({mediaTypes: ["text"], resultType: "twitter"})
    monitor = IWitness.VisibilityMonitor.create({result: result});
    var types = IWitness.filter.get("availableMediaTypes");
    types.forEach(function(type) {
      if (type.get("type") == "text") type.set("active", true);
      if (type.get("type") == "picture") type.set("active", false);
    });

    var services = IWitness.filter.get("availableServices");
    services.forEach(function(svc) {
      if (svc.get("type") == "twitter") {
        twitterService = svc;
        svc.set("active", true);
      }
      if (svc.get("type") == "flickr") svc.set("active", false);
    });

  });

  describe("scroll pause (holding filters constant)", function() {
    it("is hidden when currently paused", function() {
      IWitness.hiddenItemsController.pause();
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

  describe("filtering by service", function() {
    it("returns true when service matches result type", function() {
      twitterService.set('active', true);
      expect(monitor.get("isVisible")).toBeTruthy();
    });

    it("returns false when service does not match result type", function() {
      twitterService.set('active', false);
      expect(monitor.get("isVisible")).toBeFalsy();
    });
  });
});
