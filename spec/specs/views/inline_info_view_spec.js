describe("IWitness.InlineInfoView", function() {
  var view, criteria, twitterMonitor, flickrMonitor;

  beforeEach(function() {
    view = IWitness.InlineInfoView.create();
    criteria = IWitness.criteriaController.get("content");
    twitterMonitor = IWitness.searchController.getPath("monitors.twitter");
    flickrMonitor = IWitness.searchController.getPath("monitors.flickr");

    criteria.setProperties({
      rawEnd: moment().add('days', 1),
      zoom: 10
    });
  });

  describe("message", function() {
    beforeEach(function() {
      twitterMonitor.set("status", "no results");
    });

    it("returns a no results message", function() {
      flickrMonitor.set("status", "no results");
      Ember.run.sync();
      expect(view.get("message")).toMatch(/We couldn't find anything/);
    });

    it("returns a not much here message", function() {
      flickrMonitor.set("status", "finished");
      Ember.run.sync();
      expect(view.get("message")).toMatch(/There's not much here/);
    });

    it("returns a > 7 days message", function() {
      criteria.set("rawEnd", moment().subtract("days", 8));
      Ember.run.sync();
      expect(view.get("message")).toMatch(/Twitter doesn't let us look back in time/);
    });

    it("returns a zoom level message", function() {
      criteria.set("zoom", 19);
      Ember.run.sync();
      expect(view.get("message")).toMatch(/You're zoomed pretty far in on the map/);
    });
  });

  describe("isVisible", function() {
    it("returns false when search is in progress", function() {
      twitterMonitor.set("status", "searching");
      flickrMonitor.set("status", "searching");
      Ember.run.sync();
      expect(view.get("isVisible")).toBeFalsy();
    });

    it("returns false when there are both flickr and twitter results", function() {
      twitterMonitor.set("status", "completed");
      flickrMonitor.set("status", "completed");
      Ember.run.sync();
      expect(view.get("isVisible")).toBeFalsy();
    });

    it("returns true when search completes and there are no twitter results", function() {
      twitterMonitor.set("status", "no results");
      Ember.run.sync();
      expect(view.get("isVisible")).toBeTruthy();
    });
  });
});
