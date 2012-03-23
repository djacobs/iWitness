var TwitterSearch = function(params){
  this.params    = params;
  this.type      = 'twitter';
  this.query     = new TwitterQuery(params);
  this.filter    = new TwitterFilter(params);
  this.total     = 0;
  this.target    = 0;
  this.isStopped = false;
  this.stream    = params.stream;
  this._hasMorePages = true;
}

_.extend(TwitterSearch.prototype, {
  fetch: function(target){
    this.target += target;
    if (this.stream){
      this._startStreaming();
    } else {
      this._startSearching();
    }
  },

  _startSearching: function(){
    Ember.sendEvent(this, 'fetch');
    this.query.getNext(_.bind(this._gotData, this));
  },

  _startStreaming: function() {
    this.query.start = moment().subtract("hours", 1);
    this.query.end   = moment();
    this.liveSearch = new LiveTwitterSearch(this.params, this)
    Ember.addListener(this.liveSearch, 'data', this, this._reSendEvent);
    this._startSearching();
  },

  stop: function() {
    this.isStopped = true;
    if (this.liveSearch) {
      Ember.removeListener(this.liveSearch, 'data', this._reSendEvent);
      this.liveSearch.stop();
      Ember.sendEvent(this, 'done');
    }
  },

  hasMorePages: function(){
    return !this.query.isDone;
  },

  _reSendEvent: function(search, e, data){
    Ember.sendEvent(this, 'data', data);
  },

  _doneSearching: function(){
    if (this.stream) {
      Ember.sendEvent(this, 'streaming');
    } else {
      Ember.sendEvent(this, 'done');
    }
  },

  _gotData: function(data){
    if(data.error) {
      IWitness.log("Twitter error: %s", data.error);
      return this._doneSearching();
    }
    if(!data.results.length) return this._doneSearching();

    var filtered = this.filter.filter(data.results);

    IWitness.log('%s to %s - %s found / %s passed',
                moment(_.first(data.results).created_at).format('MM/DD hh:mma'),
                moment(_.last(data.results).created_at).format('MM/DD hh:mma'),
                data.results.length,
                filtered.length);

    if (filtered.length)
      Ember.sendEvent(this, 'data', filtered);

    this.total += filtered.length;

    if (this.total >= this.target) {
      IWitness.log('--- got %s total results ---', this.total);
      this._doneSearching();
    } else if ( !this.query.isDone && !this.isStopped ) {
      this.query.getNext(_.bind(this._gotData, this));
    } else {
      this._doneSearching();
    }
  }

});
