describe("criteriaController", function(){
  var controller, flickrSearch, twitterSearch, content;

  beforeEach(function(){
    content = Ember.Object.create({ isValid: true, stream: true });
    controller = IWitness.criteriaController;
    controller.set('content', content);
    spyOn(controller, 'changeUrl');
  });

  describe("initiateSearch", function(){
    it("clears result set", function(){
      var clearResultsSpy = spyOn(IWitness.resultSetController, 'clearResults');
      controller.initiateSearch();
      expect(clearResultsSpy).toHaveBeenCalled();
    });

    it("resets the search controller", function(){
      var clearResultsSpy = spyOn(IWitness.searchController, 'reset');
      controller.initiateSearch();
      expect(clearResultsSpy).toHaveBeenCalled();
    });
  });
});
