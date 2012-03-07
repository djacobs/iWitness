var TwitterQuery = function(params){
  this.params  = params;
  this.start   = moment(params.start);
  this.end     = moment(params.end);
  this.keyword = params.keyword;
  this.maxId   = null;
  this.isDone  = false;
}

_.extend(TwitterQuery.prototype, {
  getNext: function(callback) {
    if(this.isDone) throw "Out of bounds";

    if (!this.maxId) {
      this.determineStartingPoint(_.bind(this.fetchResultsPage, this, callback));
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
    this.maxId = TwitterCache.getClosestTweetId(this.end);

    this.fetchResults({page: 15}, function(data) {
      var lastTweet = _.last(data.results);
      var lastTweetAt;

      if (!lastTweet) return callback();
      lastTweetAt = moment(lastTweet.created_at);
      TwitterCache.storeTweet(lastTweet.id_str, lastTweetAt);

      if (lastTweetAt.isAfter(self.end)) {
        IWitness.log('fast-forward 15 pages to id %s', lastTweetAt.format("hh:mm"));
        self.maxId = lastTweet.id_str;
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
      function(response) { callback(response) }
    );
    //TODO handle when results property does not exist in response
  },

  fetchResultsPage: function(callback){
    var self = this;

    self.fetchResults({}, function(data) {
      if (!data.error) {
        var lastTweet = _.last(data.results);
        self.checkForEnd(data.results);
        if(lastTweet) self.maxId = lastTweet.id_str;
      }
      callback(data);
    });
  },

  checkForEnd: function(results){
    var last     = _.last(results);
    var lastTime = last && moment(last.created_at);

    if (!last) {
      IWitness.log('--- no more results ---');
      this.isDone = true;
    } else if (lastTime < this.start){
      IWitness.log('--- end of timeframe ---');
      this.isDone = true;
    } else if (this.maxId == last.id_str) {
      IWitness.log('--- consecutive search with same results ---');
      this.isDone = true;
    }
  }
});

