describe("criteriaController", function(){
  var controller, flickrSearch, twitterSearch, content;

  beforeEach(function(){
    controller = IWitness.criteriaController;
    spyOn(controller, '_executeSearch');
    spyOnProperties(controller.get('content'), { isValid: true, stream: true });
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
