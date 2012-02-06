var Twitter = {
  parser: function(callback){
    return function(results){
      results = _.filter(results.results, function(result){
        return result.geo != null;
      });
      callback(results);
    };
  },

  search: function(criteria, callback){
    $.getJSON(
      "http://search.twitter.com/search.json?callback=?",
      Twitter.adaptParams(criteria),
      Twitter.parser(callback)
    );
  },

  adaptParams: function(p){
    return {
      q: p.keyword,
      geocode: p.location,
      rpp: 100
    };
  }
};
