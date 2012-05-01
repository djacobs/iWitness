describe("criteriaController", function(){
  var controller, flickrSearch, twitterSearch, content;

  beforeEach(function(){
    content = Ember.Object.create({ isValid: true, stream: true });
    controller = IWitness.criteriaController;
    controller.set('content', content);
    spyOn(controller, '_executeSearch');
  });

  describe("initiateSearch", function(){
    it("clears result set", function(){
      var clearResultsSpy = spyOn(IWitness.resultSetController, 'clearResults');
      controller.initiateSearch();
      waits(10);
      runs(function() { expect(clearResultsSpy).toHaveBeenCalled(); })
    });

    it("resets the search controller", function(){
      var resetSpy = spyOn(IWitness.searchController, 'reset');
      controller.initiateSearch();
      waits(10);
      runs(function() { expect(resetSpy).toHaveBeenCalled(); });
    });
  });
});
