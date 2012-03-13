describe("IWitness.curatedSetController", function() {
  var controller, result, duplicate;

  beforeEach(function() {
    controller = IWitness.curatedSetController;
    spyOn(CuratedResultsCache, 'add');
    spyOn(CuratedResultsCache, 'remove');
    spyOn(CuratedResultsCache, 'forEach');
    controller.set('content', []);
    controller.set('_resultIds', []);
    result    = { get: function(){ return 1;}
                , name: 'result' };
    duplicate = { get: function(){ return 1;}
                , name: 'duplicate' };
  });

  describe("an uncurated result", function(){
    it("is added when toggled", function() {
      controller.toggleCuration(result);
      expect(controller.get('content')).toContain(result);
    });

    it("has an 'uncurated' status", function() {
      controller.toggleCuration(result);
      expect(controller.isCurated(result)).toBeTruthy();
      expect(controller.isCurated(duplicate)).toBeTruthy();
    });
  });

  describe("a curated result", function(){
    beforeEach(function() {
      controller.toggleCuration(result);
    });

    it("is removed when toggled", function() {
      expect(controller.get('content')).toContain(result);
      controller.toggleCuration(result);
      expect(controller.get('content')).not.toContain(result);
    });

    it("is removed when a duplicate is toggled", function() {
      expect(controller.get('content')).toContain(result);
      controller.toggleCuration(duplicate);
      expect(controller.get('content')).not.toContain(result);
    });

    it("has a 'curated' status", function() {
      expect(controller.isCurated(result)).toBeTruthy();
      expect(controller.isCurated(duplicate)).toBeTruthy();
      controller.toggleCuration(result);
      expect(controller.isCurated(result)).toBeFalsy();
      expect(controller.isCurated(duplicate)).toBeFalsy();
    });

  });
});

