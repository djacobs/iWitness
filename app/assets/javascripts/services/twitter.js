var TwitterSearch = function(params){
  this.params = params;
  this.start_time = this.getTimeInUTC(params.start_time);
  this.end_time = this.getTimeInUTC(params.end_time);
}

_.extend(TwitterSearch.prototype, {
  parser: function(callback){
    return function(results){
      results = _.filter(results.results, function(result){
        return result.geo != null;
      });
      callback(results);
    };
  },

  fetchResults: function(callback){
    $.getJSON(
      "http://search.twitter.com/search.json?callback=?",
      this.adaptParams(),
      this.parser(callback)
    );
  },

  adaptParams: function(){
    return {
      result_type: 'recent',
      q: this.params.keyword,
      geocode: this.params.location,
      since: this.start_time.format('YYYY-MM-DD'),
      until: this.end_time.add('days', 1).format('YYYY-MM-DD'),
      rpp: 100
    };
  },

  getTimeInUTC: function(dateString) {
    var date = moment(dateString)
    date.add('minutes', date.zone());
    return date;
  }
});
