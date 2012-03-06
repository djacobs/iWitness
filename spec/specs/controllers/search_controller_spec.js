describe("searchController", function(){
  var controller, flickrSearch, twitterSearch, content;

  beforeEach(function(){
    controller = IWitness.searchController;
    content = Ember.Object.create({
      searchParams: function(){return {}},
      isValid: true
    });
    controller.set('content', content);
    twitterSearch = {
      type: 'twitter',
      fetch: jasmine.createSpy("twitterSearch.fetch"),
      stop:  jasmine.createSpy("twitterSearch.stop"),
      startStreaming: jasmine.createSpy("twitterSearch.startStreaming")
    }
    spyOn(window, 'TwitterSearch').andReturn(twitterSearch);

    flickrSearch = {
      type: 'flickr',
      fetch: jasmine.createSpy("flickrSearch.fetch"),
      stop:  jasmine.createSpy("flickrSearch.stop"),
      startStreaming: jasmine.createSpy("flickrSearch.startStreaming")
    }
    spyOn(window, 'FlickrSearch').andReturn(flickrSearch);
  });

  describe('twitter results', function() {
    it("adds twitter results to the result set", function(){
      resultSetSpy = spyOn(IWitness.resultSetController, 'pushResults');
      controller.search();
      Ember.sendEvent(twitterSearch, 'data', "tweets");
      expect(resultSetSpy).toHaveBeenCalledWith('twitter', "tweets");
    });

    it("calls fetch on twitter", function(){
      controller.search();
      expect(twitterSearch.fetch).toHaveBeenCalled();
    });
  });

  describe('flickr results', function() {
    it("adds flickr results to the result set", function(){
      resultSetSpy = spyOn(IWitness.resultSetController, 'pushResults');
      controller.search();
      Ember.sendEvent(flickrSearch, 'data', 'photos');
      expect(resultSetSpy).toHaveBeenCalledWith('flickr', "photos");
    });

    it("calls fetch on flickr", function(){
      controller.search();
      expect(flickrSearch.fetch).toHaveBeenCalled();
    });
  });
});
