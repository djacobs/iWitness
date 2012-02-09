var TwitterSearch = function(params){
  this.params     = params;
  this.start      = moment(params.start);
  this.end        = moment(params.end);
  this.keyword    = params.keyword;
  this.location   = params.location;
  this.maxId      = null;
  this.total      = 0;

  console.log('*** searching %s - %s - %s ***', this.start.format('MM/DD hh:mm a'), this.end.format('MM/DD hh:mm a'), this.location);
}

MicroEvent.mixin(TwitterSearch);

_.extend(TwitterSearch.prototype, {
  fetch: function(target){
    var self = this;

    this.target = target;

    this.determineStartingPoint(function(){
      self.fetchResults({}, _.bind(self.parser, self));
    });
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
      this.adaptParams(params),
      function(response) { if (response.results) callback(response) }
    );
    //TODO handle when results property does not exist in response
  },

  parser: function(data){
    var self  = this;
    var maxId = this.maxId;

    var results = _.filter(data.results, function(result){
      return self.hasGeo(result) && self.inTimeframe(result);
    });

    if (data.results.length) {
      var startTime = moment(_.first(data.results).created_at).format('MM/DD hh:mma');
      var endTime   = moment(_.last(data.results).created_at).format('MM/DD hh:mma');
      console.log('%s to %s - %s found / %s passed', endTime, startTime, data.results.length, results.length);
    }

    this.total += results.length;

    this.fetchMoreResultsIfNeeded(data.results);

    this.trigger('data', results);
  },

  hasGeo: function(result){
    return result.geo != null;
  },

  inTimeframe: function(result) {
    var resultTime  = moment(result.created_at);
    var inTimeframe = resultTime.isAfter(this.start) && resultTime.isBefore(this.end);
    return inTimeframe;
  },

  fetchMoreResultsIfNeeded: function(results){
    var last     = _.last(results);
    var lastTime = last && moment(last.created_at);

    if (this.total >= this.target) {
      console.log('--- got %s total results ---', this.total);
      this.done();
    } else if (!last) {
      console.log('--- no more results ---');
      this.done();
    } else if (lastTime < this.start){
      console.log('--- end of timeframe ---');
      this.done();
    } else if (this.maxId == last.id) {
      console.log('--- consecutive search with same results ---');
      this.done();
    } else {
      this.maxId = last.id;
      this.fetchResults({}, _.bind(this.parser, this));
    }
  },

  adaptParams: function(params){
    // twitter only allows searching by whole day, ending at midnight UTC
    // make sure we include all possible results by adding a day.
    // we subtract 1 second so that if a date falls exactly at midnight
    // we do not load the extra day.
    var searchEnd = moment(this.end).subtract('seconds', 1).add('days', 1);

    return _.extend({
      result_type: 'recent',
      q:           this.keyword,
      geocode:     this.location,
      since:       this.start.formatUTC('YYYY-MM-DD'),
      until:       searchEnd.formatUTC('YYYY-MM-DD'),
      rpp:         100,
      max_id:      this.maxId
    }, params);
  },

  done: function(){
    this.trigger('done');
  }
});
