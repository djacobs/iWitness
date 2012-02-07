var TwitterSearch = function(params){
  this.params     = params;
  this.start      = moment(params.start);
  this.end        = moment(params.end);
  this.keyword    = params.keyword;
  this.location   = params.location;
  this.page       = 1;
  console.log('start at %s', this.start.format('MM/DD hh:mm a'));
  console.log('end at %s', this.end.format('MM/DD hh:mm a'));
}

MicroEvent.mixin(TwitterSearch);

_.extend(TwitterSearch.prototype, {
  perform: function(){
    console.log("fetching page "+this.page);
    $.getJSON(
      "http://search.twitter.com/search.json?callback=?",
      this.adaptParams(),
      _.bind(this.parser, this)
    );
  },

  parser: function(data){
    var self = this;
    this.fetchMoreResultsIfNeeded(data.results);

    var results = _.filter(data.results, function(result){
      return self.hasGeo(result) && self.inTimeframe(result);
    });

    this.trigger('data', results);
  },

  hasGeo: function(result){
    return result.geo != null;
  },

  inTimeframe: function(result) {
    var resultTime = moment(result.created_at);
    return resultTime.diff(this.start) > 0 && resultTime.diff(this.end) < 0;
  },

  fetchMoreResultsIfNeeded: function(results){
    this.page += 1;
    if (this.page > 15) return this.done();
    var last = _.last(results);
    if (!last) return this.done();
    var lastTime = moment(last.created_at);
    if (lastTime > this.start){
      this.perform();
    } else {
      this.done();
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
      page:        this.page
    };
  },

  done: function(){
    this.trigger('end');
  }
});
