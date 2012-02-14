var TwitterQuery = function(params){
  this.params  = params;
  this.start   = moment(params.start);
  this.end     = moment(params.end);
  this.keyword = params.keyword;
  this.maxId   = null;
  this.isDone  = false;
}

MicroEvent.mixin(TwitterQuery);
_.extend(TwitterQuery.prototype, {
  getNext: function(callback) {
    if(this.isDone) throw "Out of bounds";

    if (!this.maxId) {
      this.determineStartingPoint(this.fetchResultsPage.bind(this, callback));
    } else {
      this.fetchResultsPage(callback);
    }
  },

  location: function() {
    return this.params.center.join(',') + "," + this.params.radius + "km";
  },

  queryParams: function(params){
    // twitter only allows searching by whole day, ending at midnight UTC
    // make sure we include all possible results by adding a day.
    // we subtract 1 second so that if a date falls exactly at midnight
    // we do not load the extra day.
    var searchEnd = moment(this.end).subtract('seconds', 1).add('days', 1);

    return _.extend({
      result_type: 'recent',
      q:           this.keyword,
      geocode:     this.location(),
      since:       this.start.formatUTC('YYYY-MM-DD'),
      until:       searchEnd.formatUTC('YYYY-MM-DD'),
      rpp:         100,
      max_id:      this.maxId
    }, params);
  },

  determineStartingPoint: function(callback) {
    var self = this;

    this.fetchResults({page: 15}, function(data) {
      var lastTweet = _.last(data.results);
      var lastTweetAt;

      if (!lastTweet) return callback();
      lastTweetAt = moment(lastTweet.created_at);

      if (lastTweetAt.isAfter(self.end)) {
        console.log('fast-forward 15 pages to id %s', lastTweetAt.format("hh:mm"));
        self.maxId = lastTweet.id;
        self.determineStartingPoint(callback);
      } else {
        callback();
      }
    });
  },

  fetchResults: function(params, callback) {
    $.getJSON(
      "http://search.twitter.com/search.json?callback=?",
      this.queryParams(params),
      function(response) { if (response.results) callback(response) }
    );
    //TODO handle when results property does not exist in response
  },

  fetchResultsPage: function(callback){
    var self = this;

    self.fetchResults({}, function(data) {
      var lastTweet = _.last(data.results);

      self.checkForEnd(data.results);
      if(lastTweet) self.maxId = lastTweet.id;
      callback(data);
    });
  },

  checkForEnd: function(results){
    var last     = _.last(results);
    var lastTime = last && moment(last.created_at);

    if (!last) {
      console.log('--- no more results ---');
      this.isDone = true;
    } else if (lastTime < this.start){
      console.log('--- end of timeframe ---');
      this.isDone = true;
    } else if (this.maxId == last.id) {
      console.log('--- consecutive search with same results ---');
      this.isDone = true;
    }
  }
});

