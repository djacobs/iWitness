var TwitterSearch = function(params){
  this.query       = new TwitterQuery(params);
  this.filter      = new TwitterFilter(params);
  console.log('*** searching %s - %s ***', params.start, params.end);
}

MicroEvent.mixin(TwitterSearch);

_.extend(TwitterSearch.prototype, {
  fetch: function(target){
    var self  = this;
    var total = 0;

    self.query.bind('data', function(data){
      if(!data.results.length) return self.done();
      var filtered = self.filter.filter(data.results);

      console.log('%s to %s - %s found / %s passed',
                  moment(_.first(data.results).created_at).format('MM/DD hh:mma'),
                  moment(_.last(data.results).created_at).format('MM/DD hh:mma'),
                  data.results.length,
                  filtered.length);

      if (filtered.length) self.trigger('data', filtered);
      total += filtered.length;

      if (total >= target) {
        console.log('--- got %s total results ---', total);
        self.done();
      } else {
        self.query.getNext();
      }
    });

    self.query.bind('done', function(){ self.done() })
    self.query.getNext();
  },

  done: function(){
    this.trigger('done');
  }
});

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
  getNext: function() {
    if(this.isDone) throw "Out of bounds";

    if (!this.maxId) {
      this.determineStartingPoint(this.fetchResultsTriggeringEvents.bind(this));
    } else {
      this.fetchResultsTriggeringEvents();
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

  fetchResultsTriggeringEvents: function(){
    var self = this;

    self.fetchResults({}, function(data) {
      var lastTweet = _.last(data.results);
      self.checkForEnd(data.results);
      if(lastTweet) self.maxId = lastTweet.id;
      self.trigger('data', data);
    });
  },

  checkForEnd: function(results){
    var last     = _.last(results);
    var lastTime = last && moment(last.created_at);

    if (!last) {
      console.log('--- no more results ---');
      this.done();
    } else if (lastTime < this.start){
      console.log('--- end of timeframe ---');
      this.done();
    } else if (this.maxId == last.id) {
      console.log('--- consecutive search with same results ---');
      this.done();
    }
  },

  done: function() {
    this.isDone = true;
    this.trigger('done');
  }
});

var TwitterFilter = function(params) {
  this.start = moment(params.start);
  this.end   = moment(params.end);
  this.box   = new Map.Box(params.southWest, params.northEast);
};

_.extend(TwitterFilter.prototype, {
  hasGeo: function(result){
    if (result.geo == null) return false;
    var coordinates = result.geo.coordinates;
    return this.box.contains(coordinates[0], coordinates[1]);
  },

  inTimeframe: function(result) {
    var resultTime  = moment(result.created_at);
    var inTimeframe = resultTime.isAfter(this.start) && resultTime.isBefore(this.end);
    return inTimeframe;
  },

  filter: function(results) {
    var self = this;
    return _.filter(results, function(result){
      return self.hasGeo(result) && self.inTimeframe(result);
    });
  }
});
