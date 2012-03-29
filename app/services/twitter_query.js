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
    return this.params.center.join(',') + "," + Math.ceil(this.params.radius / 1000) + "km";
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
      max_id:      this.maxId,
      include_entities: true
    }, params);
  },

  determineStartingPoint: function(callback) {
    var self = this;
    this.maxId = TwitterTimestampCache.getClosestTweetId(this.end);

    this.fetchResults({page: 15}, function(data) {
      var lastTweet = _.last(data.results);
      var lastTweetAt;

      if (!lastTweet) return callback();
      lastTweetAt = moment(lastTweet.created_at);
      TwitterTimestampCache.storeTweet(lastTweet.id_str, lastTweetAt);

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
    var self = this;
    var tryCount = 0;

    var makeRequest = function() {
      $.ajax({
        url:      "http://search.twitter.com/search.json?callback=?",
        dataType: 'jsonp',
        data:     self.queryParams(params),
        success:  function(response) { callback(response) },
        error:    retry
      });
    }

    var retry = function() {
      tryCount++;
      if (tryCount < 3) { setTimeout(makeRequest, 1000) }
    }

    makeRequest();
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
  },

  setLiveStream: function() {
    this.start = moment().subtract("hours", 1);
    this.end   = moment();
  }

});
