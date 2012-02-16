describe("searchController", function(){
  var controller, flickrSearch, twitterSearch, content;

  beforeEach(function(){
    controller = IWitness.searchController;
    content = Ember.Object.create({
      searchParams: function(){return {}},
      isValid: true
    });
    controller.set('content', content);
    flickrSearch = new MicroEvent();
    flickrSearch.fetch = jasmine.createSpy("flickrSearch.fetch");
    spyOn(window, 'FlickrSearch').andReturn(flickrSearch);
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

  it("adds flickr results to the result set", function(){
    resultSetSpy = spyOn(IWitness.resultSetController, 'pushResults');
    controller.search();
    flickrSearch.trigger('data', "photos");
    expect(resultSetSpy).toHaveBeenCalledWith('FlickrResult', "photos");
  });

  it("sets searching to true", function(){
    controller.search();
    expect(controller.get('searching')).toBeTruthy();
  });

  it("sets searching to false when flickr and twitter searches complete", function(){
    controller.search();
    flickrSearch.trigger('done');
    expect(controller.get('searching')).toBeFalsy();
  });

  it("calls fetch on flickr", function(){
    controller.search();
    expect(flickrSearch.fetch).toHaveBeenCalled();
  });
});
