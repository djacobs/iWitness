describe("IWitness.starredSetController", function() {
  var controller, result, duplicate;

  beforeEach(function() {
    controller = IWitness.starredSetController;
    spyOn(StarredResultsCache, 'add');
    spyOn(StarredResultsCache, 'remove');
    spyOn(StarredResultsCache, 'forEach');
    controller.set('content', []);
    controller.set('_resultIds', []);
    result    = { get: function(){ return 1;}
                , name: 'result' };
    duplicate = { get: function(){ return 1;}
                , name: 'duplicate' };
  });

  describe("an unstarred result", function(){
    it("is added when toggled", function() {
      controller.toggleCuration(result);
      expect(controller.get('content')).toContain(result);
    });

    it("has an 'unstarred status", function() {
      controller.toggleCuration(result);
      expect(controller.isStarred(result)).toBeTruthy();
      expect(controller.isStarred(duplicate)).toBeTruthy();
    });
  });

  describe("a starred result", function(){
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

    it("has a 'starred' status", function() {
      expect(controller.isStarred(result)).toBeTruthy();
      expect(controller.isStarred(duplicate)).toBeTruthy();
      controller.toggleCuration(result);
      expect(controller.isStarred(result)).toBeFalsy();
      expect(controller.isStarred(duplicate)).toBeFalsy();
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

