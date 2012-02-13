describe("TwitterSearch", function() {
  var search, params, fakeQuery, dataSpy, doneSpy;

  describe("fetch", function() {
    beforeEach(function() {
      params = {}
      fakeQuery = new TwitterQuery({center: [42,24]});
      spyOn(window, 'TwitterQuery').andReturn(fakeQuery);
      spyOn(window, 'TwitterFilter').andReturn({filter: function(rs){return rs}});
      search = new TwitterSearch(params);
      dataSpy = new jasmine.createSpy('dataSpy');
      doneSpy = new jasmine.createSpy('doneSpy');
      search.bind('data', dataSpy);
      search.bind('done', doneSpy);
    });

    it("calls query.getNext", function() {
      var querySpy = spyOn(fakeQuery, 'getNext');
      search.fetch(20);
      expect(querySpy).toHaveBeenCalled();
    });

    it("stops making requests once the requested number have been fetched", function() {
      var querySpy = spyOn(fakeQuery, 'getNext').andCallFake(function(callback){
        callback({results: makeTweets(20)});
      });
      search.fetch(20);
      expect(doneSpy).toHaveBeenCalled();
    });

    it("makes requests until the requested number have been fetched", function() {
      var querySpy = spyOn(fakeQuery, 'getNext').andCallFake(function(callback){
        callback({results: makeTweets(10)});
      });
      search.fetch(20);
      expect(doneSpy).toHaveBeenCalled();
      expect(querySpy.callCount).toEqual(2);
    });

    it("triggers a data event for each chunk of results", function() {
      var querySpy = spyOn(fakeQuery, 'getNext').andCallFake(function(callback){
        callback({results: makeTweets(10)});
      });
      search.fetch(20);
      expect(dataSpy.callCount).toEqual(2);
    });
  });
});
