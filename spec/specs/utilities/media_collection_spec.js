describe("MediaCollection", function() {
  describe("displayable", function() {
    var displayable, notDisplayable, collection;
    beforeEach(function() {
      displayable = Ember.Object.create({canDisplay: true});
      notDisplayable = Ember.Object.create({canDisplay: false});
      collection = IWitness.MediaCollection.create({content: [displayable, notDisplayable]});
    });

    it("returns all objects where canDisplay is truthy", function() {
      expect(collection.get("displayable")).toContain(displayable);
    });

    it("does not return objects where canDisplay is falsy", function() {
      expect(collection.get("displayable")).not.toContain(notDisplayable);
    });
  })
})
