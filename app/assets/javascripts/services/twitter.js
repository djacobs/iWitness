var TwitterSearch = function(params){
  this.params     = params;
  this.start      = moment(params.start);
  this.end        = moment(params.end);
  this.keyword    = params.keyword;
  this.location   = params.location;
  this.max_id     = null;

  console.log('*** searching %s - %s - %s ***', this.start.format('MM/DD hh:mm a'), this.end.format('MM/DD hh:mm a'), this.location);
}

MicroEvent.mixin(TwitterSearch);

_.extend(TwitterSearch.prototype, {
  perform: function(){
    var self = this;

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
        self.max_id = lastTweet.id;
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
      callback
    );
  },

  parser: function(data){
    var self   = this;
    var max_id = this.max_id;

    this.fetchMoreResultsIfNeeded(data.results);

    var results = _.filter(data.results, function(result){
      return self.hasGeo(result) && self.inTimeframe(result);
    });

    if (data.results.length) {
      var start_time = moment(_.first(data.results).created_at).format('MM/DD hh:mma');
      var end_time   = moment(_.last(data.results).created_at).format('MM/DD hh:mma');
      console.log('%s to %s - %s found / %s passed', end_time, start_time, data.results.length, results.length);
    }

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

    if (!last) {
      console.log('--- no more results ---');
      this.done();
    } else if (lastTime < this.start){
      console.log('--- end of timeframe ---');
      this.done();
    } else if (this.max_id == last.id) {
      console.log('--- consecutive search with same results ---');
      this.done();
    } else {
      this.max_id = last.id;
      this.fetchResults({}, _.bind(this.parser, this));
    }
  },

  adaptParams: function(params){
    return _.extend({
      result_type: 'recent',
      q:           this.keyword,
      geocode:     this.location,
      since:       this.start.formatUTC('YYYY-MM-DD'),
      until:       moment(this.end).add('days', 1).formatUTC('YYYY-MM-DD'),
      rpp:         100,
      max_id:      this.max_id
    }, params);
  },

  done: function(){
    this.trigger('done');
  }
});
