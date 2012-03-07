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

  // describe("changeUrl", function(){
  //   // it('skips a search with invalid parameters', function(){
  //   //   content.set('isValid', false);

  //   // });

  //   it('executes a search only with valid parameters', function(){
  //     routeSpy = spyOn(IWitness.routes, 'visitStream');
  //     controller.changeUrl();
  //     // waitsFor(function(){});
  //     // runs(function(){});
  //     expect(routeSpy).toHaveBeenCalled();
  //   });
  //   it('if set to streaming, call streaming');

  // });
});
