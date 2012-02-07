var TwitterSearch = function(params){
  this.params     = params;
  this.start      = moment(params.start);
  this.end        = moment(params.end);
  this.keyword    = params.keyword;
  this.location   = params.location;
  this.max_id     = null;

  console.log('*** searching %s - %s ***', this.start.format('MM/DD hh:mm a'), this.end.format('MM/DD hh:mm a'));
}

MicroEvent.mixin(TwitterSearch);

_.extend(TwitterSearch.prototype, {
  perform: function(){
    $.getJSON(
      "http://search.twitter.com/search.json?callback=?",
      this.adaptParams(),
      _.bind(this.parser, this)
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
    var inTimeframe = resultTime.diff(this.start) > 0 && resultTime.diff(this.end) < 0;
    return inTimeframe;
  },

  fetchMoreResultsIfNeeded: function(results){
    var last = _.last(results);
    if (!last) return this.done();

    var lastTime = moment(last.created_at);
    if (lastTime < this.start){
      this.done();
    } else if (this.max_id == last.id) {
      this.done();
    } else {
      this.max_id = last.id;
      this.perform();
    }
  },

  adaptParams: function(){
    return {
      result_type: 'recent',
      q:           this.keyword,
      geocode:     this.location,
      since:       this.start.formatUTC('YYYY-MM-DD'),
      until:       moment(this.end).add('days', 1).formatUTC('YYYY-MM-DD'),
      rpp:         100,
      max_id:      this.max_id
    };
  },

  done: function(){
    console.log('--- done ---');
    this.trigger('end');
  }
});
