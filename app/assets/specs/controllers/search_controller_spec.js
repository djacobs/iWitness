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

  afterEach(function() {
    controller.get('servicesBeingSearched').clear();
    controller.get('servicesWithResults').clear();
  });

  it("sets searchAttempted = true", function(){
    expect(controller.get('searchAttempted')).toBeFalsy();
    controller.search();
    expect(controller.get('searchAttempted')).toBeTruthy();
  });

  it("clears result set", function(){
    var clearResultsSpy = spyOn(IWitness.resultSetController, 'clearResults');
    expect(controller.getPath('content.isValid')).toBeTruthy();
    controller.search();
    expect(clearResultsSpy).toHaveBeenCalled();
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

  describe('twiterStatus', function(){
    it("starts with 'no results'", function(){
      expect(controller.get('twitterStatus')).toEqual("no results");
    });

    it("searching", function(){
      controller.search();
      expect(controller.get('twitterStatus')).toEqual("searching");
    });

    it("completed with no results", function(){
      controller.search();
      Ember.sendEvent(twitterSearch, 'done');
      expect(controller.get('twitterStatus')).toEqual("no results");
    });

    it("completed after results have come in", function(){
      controller.search();
      spyOn(IWitness.resultSetController, 'pushResults');
      Ember.sendEvent(twitterSearch, 'data', 'tweets');
      Ember.sendEvent(twitterSearch, 'done');
      expect(controller.get('twitterStatus')).toEqual("completed");
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

  describe('flickrStatus', function(){
    it("starts with 'no results'", function(){
      expect(controller.get('flickrStatus')).toEqual("no results");
    });

    it("searching", function(){
      controller.search();
      expect(controller.get('flickrStatus')).toEqual("searching");
    });

    it("completed with no results", function(){
      controller.search();
      Ember.sendEvent(flickrSearch, 'done');
      expect(controller.get('flickrStatus')).toEqual("no results");
    });

    it("completed after results have come in", function(){
      controller.search();
      spyOn(IWitness.resultSetController, 'pushResults');
      Ember.sendEvent(flickrSearch, 'data', 'photos');
      Ember.sendEvent(flickrSearch, 'done');
      expect(controller.get('flickrStatus')).toEqual("completed");
    });
  });

  describe('live stream', function(){
    beforeEach(function(){ content.set('stream', true) });

    it("starts twitter stream after 'done' event", function(){
      controller.search();
      spyOn(IWitness.resultSetController, 'pushResults');
      Ember.sendEvent(twitterSearch, 'done');
      expect(twitterSearch.startStreaming).toHaveBeenCalled();
      expect(controller.get('twitterStatus')).toEqual("searching");
    });

    it("starts flickr stream after 'done' event", function(){
      controller.search();
      spyOn(IWitness.resultSetController, 'pushResults');
      Ember.sendEvent(flickrSearch, 'done');
      expect(flickrSearch.startStreaming).toHaveBeenCalled();
      expect(controller.get('flickrStatus')).toEqual("searching");
    });
  });
});
