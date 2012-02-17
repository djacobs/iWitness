describe("searchController", function(){
  var controller, flickrSearch, twitterSearch, content;

  beforeEach(function(){
    controller = IWitness.searchController;
    content = Ember.Object.create({
      searchParams: function(){return {}},
      isValid: true
    });
    controller.set('content', content);
    twitterSearch = new MicroEvent();
    twitterSearch.type = 'twitter';
    twitterSearch.fetch = jasmine.createSpy("twitterSearch.fetch");
    spyOn(window, 'TwitterSearch').andReturn(twitterSearch);
    flickrSearch = new MicroEvent();
    flickrSearch.type = 'flickr';
    flickrSearch.fetch = jasmine.createSpy("flickrSearch.fetch");
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
      twitterSearch.trigger('data', 'twitter', "tweets");
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
      twitterSearch.trigger('done', 'twitter');
      expect(controller.get('twitterStatus')).toEqual("no results");
    });

    it("completed after results have come in", function(){
      controller.search();
      spyOn(IWitness.resultSetController, 'pushResults');
      twitterSearch.trigger('data', 'twitter', "tweetz");
      twitterSearch.trigger('done', 'twitter');
      expect(controller.get('twitterStatus')).toEqual("completed");
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
      flickrSearch.trigger('done', 'flickr');
      expect(controller.get('flickrStatus')).toEqual("no results");
    });

    it("completed after results have come in", function(){
      controller.search();
      spyOn(IWitness.resultSetController, 'pushResults');
      flickrSearch.trigger('data', 'flickr', "photos");
      flickrSearch.trigger('done', 'flickr');
      expect(controller.get('flickrStatus')).toEqual("completed");
    });
  });

  describe('flickr results', function() {
    it("adds flickr results to the result set", function(){
      resultSetSpy = spyOn(IWitness.resultSetController, 'pushResults');
      controller.search();
      flickrSearch.trigger('data', 'flickr', "photos");
      expect(resultSetSpy).toHaveBeenCalledWith('flickr', "photos");
    });

    it("calls fetch on flickr", function(){
      controller.search();
      expect(flickrSearch.fetch).toHaveBeenCalled();
    });
  });

});
