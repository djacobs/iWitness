describe("TwitterQuery", function() {
  var params, query, dataSpy, doneSpy, twitterResponse;
  beforeEach(function(){
    params = {start: moment().subtract('days', 5),
              end: moment()};
    query = new TwitterQuery(params);
    dataSpy = jasmine.createSpy("data event");
    query.bind('data', dataSpy);
    doneSpy = jasmine.createSpy("done event");
    query.bind('done', doneSpy);

    twitterResponse = function(){return {results: makeTweets(5)}};
    spyOn($, 'getJSON');
  });

  describe("getNext", function() {
    it("triggers done event if it runs out of results", function() {
      spyOn(query, 'fetchResults').andCallFake(function(params, callback){
        callback({results: []});
      });
      query.getNext();
      expect(doneSpy).toHaveBeenCalled();
      expect(dataSpy).toHaveBeenCalled();
    });

    it("triggers a data event for each chunk of results", function() {
      spyOn(query, 'fetchResults').andCallFake(function(params, callback){
        callback(twitterResponse());
      });
      query.getNext();
      expect(dataSpy.callCount).toEqual(1);
      query.getNext();
      expect(dataSpy.callCount).toEqual(2);
      expect(doneSpy).not.toHaveBeenCalled();
    });

    it("skips 15 pages when the next 15 pages don't reach the timeframe", function() {
      // $.mockjax({
      //   url: '/restful/api',
      //   proxy: '/mocks/data.json'
      // });

      // $.mockjaxClear();
    });
    it("omits results that do not have the keyword", function(){
    });
    it("includes results that have the keyword", function(){
    });
  });
});
