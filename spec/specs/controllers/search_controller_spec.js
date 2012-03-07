describe("searchController", function(){
  var controller, flickrSearch, twitterSearch, content;

  beforeEach(function(){
    controller = IWitness.searchController;
    content = Ember.Object.create({ // criteria model
      getParams: function(){return { start: moment(), end: moment() }},
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

    Analytics = { track: function(){ console.log("Fake Analytics: ", arguments);} };
  });

  describe('twitter results', function() {
    it("adds twitter results to the result set", function(){
      resultSetSpy = spyOn(IWitness.resultSetController, 'pushResults');
      controller.search(content.getParams());
      Ember.sendEvent(twitterSearch, 'data', "tweets");
      expect(resultSetSpy).toHaveBeenCalledWith('twitter', "tweets");
    });

    it("calls fetch on twitter", function(){
      controller.search(content.getParams());
      expect(twitterSearch.fetch).toHaveBeenCalled();
    });
  });

  describe('flickr results', function() {
    it("adds flickr results to the result set", function(){
      resultSetSpy = spyOn(IWitness.resultSetController, 'pushResults');
      controller.search(content.getParams());
      Ember.sendEvent(flickrSearch, 'data', 'photos');
      expect(resultSetSpy).toHaveBeenCalledWith('flickr', "photos");
    });

    it("calls fetch on flickr", function(){
      controller.search(content.getParams());
      expect(flickrSearch.fetch).toHaveBeenCalled();
    });
  });
});
