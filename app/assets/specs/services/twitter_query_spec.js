describe("TwitterQuery", function() {
  var params, query, dataSpy, doneSpy, twitterResponse;
  var init = function(options){
    params = _.extend({
      start: moment("02/12/12 17:00 +0000"),
      end: moment("02/12/12 21:30 +0000"),
      center: [34.043343,-118.267179],
      radius: 1
    }, options);
    query = new TwitterQuery(params);
  };

  beforeEach(function() {
    localStorage.clear();
  });

  describe("getNext", function() {
    it("sets isDone when it runs out of results", function() {
      init({
        start: moment("02/12/12 23:30 +0000"), 
        end: moment("02/13/12 00:00 +0000"),
        keyword: 'days'
      });
      var spy = spyOnTwitterCall('singlePage');
      var ok = false;
      query.getNext(function(){ ok = true });
      waitsFor(function(){ return ok });
      runs(function(){
        expect(query.isDone).toBeTruthy();
      });
    });

    it("skips 15 pages when the next 15 pages don't reach the timeframe", function() {
      init({ start: moment("02/12/12 17:00 +0000"), end: moment("02/12/12 21:30 +0000") });
      var spy = spyOnTwitterCall('grammys')
      var ok = false;
      query.getNext(function(){ ok = true });
      waitsFor(function(){ return ok });
      runs(function(){ expect(spy.callCount).toEqual(3) });
    });

    it("subsequent calls to getNext do not skip pages", function() {
      init({ start: moment("02/12/12 17:00 +0000"), end: moment("02/12/12 21:30 +0000") });
      var spy = spyOnTwitterCall('grammys')
      var ok = false;
      query.getNext(function(){ ok = true });
      waitsFor(function(){ return ok });
      runs(function(){
        ok = false;
        query.getNext(function(){ ok = true });
      });
      waitsFor(function(){ return ok });
      runs(function(){ expect(spy.callCount).toEqual(4) });
    });
  });
});
