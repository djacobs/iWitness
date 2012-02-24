var TwitterSearch = function(params){
  this.params    = params;
  this.type      = 'twitter';
  this.query     = new TwitterQuery(params);
  this.filter    = new TwitterFilter(params);
  this.total     = 0;
  this.target    = 0;
  this.isStopped = false;
  IWitness.log('*** searching %s - %s ***', params.start, params.end);
}

_.extend(TwitterSearch.prototype, {
  fetch: function(target){
    if( this.isStopped ) return Ember.sendEvent(this, 'done');
    
    this.target += target;
    this.query.getNext(_.bind(this._gotData, this));
  },

  startStreaming: function(pollingInterval) {
    this.liveSearch = new LiveTwitterSearch(this.params)
    this.liveSearch.sinceId = this.maxId;
    Ember.addListener(this.liveSearch, 'data', this, this._reSendEvent);
    this.liveSearch.start(pollingInterval);
  },

  stop: function() {
    this.isStopped = true;
    if (this.liveSearch) {
      Ember.removeListener(this.liveSearch, 'data', this._reSendEvent);
      this.liveSearch.stop();
    }
  },

  _reSendEvent: function(search, e, data){
    Ember.sendEvent(this, 'data', data);
  },

  _gotData: function(data){
    if(!data.results.length) return Ember.sendEvent(this, 'done');
    if(!this.maxId) this.maxId = data.results[0].id_str;

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
      Ember.sendEvent(this, 'done');
    } else if ( !this.query.isDone && !this.isStopped ) {
      this.query.getNext(_.bind(this._gotData, this));
    } else {
      Ember.sendEvent(this, 'done');
    }
  }

});

