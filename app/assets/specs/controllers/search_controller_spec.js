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
    controller.get('activeSearches').clear();
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

  it("sets searching to true", function(){
    controller.search();
    expect(controller.get('searching')).toBeTruthy();
  });

  it("sets searching to false when flickr and twitter searches complete", function(){
    controller.search();
    flickrSearch.trigger('done', 'flickr');
    expect(controller.get('searching')).toBeTruthy();
    twitterSearch.trigger('done', 'twitter');
    expect(controller.get('searching')).toBeFalsy();
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
