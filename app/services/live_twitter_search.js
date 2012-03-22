var LiveTwitterSearch = function(params, search){
  this.type      = 'twitter';
  this.params    = params;
  this.sinceId   = params.sinceId;
  this.filter    = new TwitterFilter(params);
  this.total     = 0;
  this.isStopped = false;
  this.currentPage = 1;
  Ember.addListener(search, 'streaming', this, this.start);
};

_.extend(LiveTwitterSearch.prototype, {
  start: function() {
    IWitness.log("starting live twitter stream");
    this._fetchInitial(_.bind(this._gotInitialData, this));
  },

  _fetchInitial: function(callback) {
    $.getJSON(
      "http://search.twitter.com/search.json?callback=?",
      {
        result_type: 'recent',
        q:           this.params.keyword,
        geocode:     this.location(),
        rpp:         100,
        until:       moment().add('days', 1).format('YYYY-MM-DD'),
        page:        this.currentPage
      },
      function(response) { if (response.results) callback(response) }
    );
  },

  _gotInitialData: function(response) {
    this.sinceId = response.results[0].id_str;

    var self = this;
    this.fetchResults(_.bind(this._gotData, this));
    this.interval = setInterval(function(){
      self.fetchResults(_.bind(self._gotData, self));
    }, IWitness.config.pollInterval*1000);
  },

  _gotData: function(data){
    IWitness.log("got twitter data", data);
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
      page:        this.currentPage,
      include_entities: true
    };
  },

  location: function() {
    return this.params.center.join(',') + "," + Math.ceil(this.params.radius / 1000) + "km";
  }
});
