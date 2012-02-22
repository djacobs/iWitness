var LiveTwitterSearch = function(params){
  this.type      = 'twitter';
  this.params    = params;
  this.sinceId   = params.sinceId;
  this.filter    = new TwitterFilter(params);
  this.total     = 0;
  this.isStopped = false;
  IWitness.log('*** Live searching %s - %s ***', params.start, params.end);
};

_.extend(LiveTwitterSearch.prototype, {
  start: function(pollingInterval) {
    var self = this;
    self.fetchResults(_.bind(self._gotData, self));
    setInterval(function(){
      self.fetchResults(_.bind(self._gotData, self));
    }, pollingInterval*1000);
  },

  _gotData: function(data){
    console.log('gotdata', data);
    if(data.results.length) this.sinceId = data.results[0].id_str;
    var filtered = this.filter.filterGeo(data.results);
    if (!_.isEmpty(filtered)){
      Ember.sendEvent(this, 'data', filtered);
    }
  },

  stop: function(){
  },

  fetchResults: function(callback) {
    console.log('fetching...');
    $.getJSON(
      "http://search.twitter.com/search.json?callback=?",
      this.queryParams(),
      function(response) { if (response.results) callback(response) }
    );
    //TODO handle when results property does not exist in response
  },

  queryParams: function(){
    return {
      result_type: 'recent',
      q:           this.params.keyword,
      geocode:     this.location(),
      rpp:         100,
      since_id:    this.sinceId
    };
  },

  location: function() {
    return this.params.center.join(',') + "," + this.params.radius + "km";
  }
});
