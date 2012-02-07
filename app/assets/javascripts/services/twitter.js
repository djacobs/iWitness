var TwitterSearch = function(params){
  this.params     = params;
  this.start      = this.getTimeInUTC(params.start);
  this.end        = this.getTimeInUTC(params.end);
  this.keyword    = params.keyword;
  this.location   = params.location;
}

MicroEvent.mixin(TwitterSearch);

_.extend(TwitterSearch.prototype, {
  perform: function(){
    var self = this,
        page = 1;

    self.bind('raw-data', function(results){
      page += 1;
      if (page > 15) return self.done();
      var last = _.last(results);
      if (!last) return self.done();
      var lastTime = moment(last.created_at);
      if (lastTime > self.start){
        self.fetchResults(page);
      } else {
        self.done();
      }
    });
    self.fetchResults(page);
  },

  parser: function(data){
    this.trigger('raw-data', data.results);
    var results = _.filter(data.results, function(result){
      return result.geo != null;
    });
    this.trigger('data', results);
  },

  fetchResults: function(page){
    console.log("fetching page "+page);
    $.getJSON(
      "http://search.twitter.com/search.json?callback=?",
      this.adaptParams(page),
      _.bind(this.parser, this)
    );
  },

  adaptParams: function(page){
    return {
      result_type: 'recent',
      q:           this.keyword,
      geocode:     this.location,
      since:       this.start.format('YYYY-MM-DD'),
      until:       this.end.add('days', 1).format('YYYY-MM-DD'),
      rpp:         100,
      page:        page
    };
  },

  getTimeInUTC: function(dateString) {
    var date = moment(dateString)
    date.add('minutes', date.zone());
    return date;
  },

  done: function(){
    this.trigger('end');
  }
});
