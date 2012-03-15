describe("hiddenItemsController", function(){
  var controller;
  function clearResultSetController(){
    IWitness.resultSetController.clearResults();
    IWitness.resultSetController.resume();
  }
  beforeEach(clearResultSetController);
  afterEach(clearResultSetController);

  describe("when paused", function(){
    beforeEach(function(){
      controller = IWitness.hiddenItemsController;
      controller.setProperties({paused: true, hiddenItemsCount: 0});
    });

    it("increments hiddenItemsCount when results are added", function(){
      IWitness.resultSetController.pushResults('twitter', makeTweets(3));
      expect(controller.get("hiddenItemsCount")).toEqual(3);
    });

    it("unpause resets some properties", function(){
      controller.set("hiddenItemsCount", 5);
      controller.unpause();
      expect(controller.get("paused")).toBeFalsy();
      expect(controller.get("hiddenItemsCount")).toEqual(0);
    });
  });

  describe("when not paused", function(){
    beforeEach(function(){
      controller = IWitness.hiddenItemsController;
      controller.setProperties({paused: false, hiddenItemsCount: 0});
    });

    it("does not increment hiddenItemsCount", function(){
      IWitness.resultSetController.pushResults('twitter', makeTweets(1));
      expect(controller.get("hiddenItemsCount")).toEqual(0);
    });
  });
});
