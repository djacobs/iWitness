describe("IWitness.savedSetController", function() {
  var controller, result, duplicate;

  beforeEach(function() {
    controller = IWitness.savedSetController;
    spyOn(SavedResultsCache, 'add');
    spyOn(SavedResultsCache, 'remove');
    spyOn(SavedResultsCache, 'forEach');
    controller.set('content', []);
    controller.set('_resultIds', []);
    result    = { get: function(){ return 1;}
                , name: 'result' };
    duplicate = { get: function(){ return 1;}
                , name: 'duplicate' };
  });

  describe("an unsaved result", function(){
    it("is added when toggled", function() {
      controller.toggleCuration(result);
      expect(controller.get('content')).toContain(result);
    });

    it("has an 'unsaved status", function() {
      controller.toggleCuration(result);
      expect(controller.isSaved(result)).toBeTruthy();
      expect(controller.isSaved(duplicate)).toBeTruthy();
    });
  });

  describe("a saved result", function(){
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

    it("has a 'saved' status", function() {
      expect(controller.isSaved(result)).toBeTruthy();
      expect(controller.isSaved(duplicate)).toBeTruthy();
      controller.toggleCuration(result);
      expect(controller.isSaved(result)).toBeFalsy();
      expect(controller.isSaved(duplicate)).toBeFalsy();
    });

  });

  describe("clearing all results", function(){
    beforeEach(function() {
      controller.toggleCuration(result);
      window.confirm = function() { return true; };
    });

    it("should remove all results from the content", function() {
      expect(controller.get('content')).toContain(result);
      controller.clear();
      expect(controller.get('content')).not.toContain(result);
    });
  });
});
