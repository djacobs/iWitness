var LiveTwitterSearch = function(params){
  this.type      = 'twitter';
  this.params    = params;
  this.sinceId   = params.sinceId;
  this.filter    = new TwitterFilter(params);
  this.total     = 0;
  this.isStopped = false;
  this.currentPage = 1;
};

_.extend(LiveTwitterSearch.prototype, {
  start: function() {
    var self = this;
    self.fetchResults(_.bind(self._gotData, self));
    this.interval = setInterval(function(){
      self.fetchResults(_.bind(self._gotData, self));
    }, IWitness.config.pollInterval*1000);
  },

  _gotData: function(data){
    if(data.error) {
      IWitness.log("Twitter error: %s", data.error);
    }
    this.sinceId = data.max_id_str;

    var filtered = this.filter.filterGeo(data.results);
    if (!_.isEmpty(filtered)){
      Ember.sendEvent(this, 'data', filtered);
    }

    if (this.currentPage < 15 && data.results.length) {
      this.currentPage++;
      this.fetchResults(_.bind(this._gotData, this));
    } else {
      this.currentPage = 1;
    }
  },

  stop: function(){
    clearInterval(this.interval);
  },

  fetchResults: function(callback) {
    IWitness.log('requesting', this.queryParams());
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
      since_id:    this.sinceId,
      page:        this.currentPage
    };
  },

  location: function() {
    return this.params.center.join(',') + "," + this.params.radius + "km";
  }
});
