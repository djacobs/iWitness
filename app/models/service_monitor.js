IWitness.ServiceMonitor = Ember.Object.extend({
  status: 'no results',
  hasData: false,
  hasMorePages: true,
  total: 0,
  search: null,

  reset: function(){
    this.set('search', null);
  },

  _clearPreviousStatus: function() {
    var search = this.get('search');
    if (search){
      Ember.removeListener(search, 'fetch', this, this._startFetch);
      Ember.removeListener(search, 'streaming', this, this._startStreaming);
      Ember.removeListener(search, 'data', this, this._handleResults);
      Ember.removeListener(search, 'done', this, this._endFetch);
    }

    this.setProperties({
      status: 'pending',
      hasData: false,
      hasMorePages: true
    });
  }.observesBefore('search'),

  _attachSearchListeners: function() {
    var search = this.get('search');
    if(search){
      Ember.addListener(search, 'fetch', this, this._startFetch);
      Ember.addListener(search, 'streaming', this, this._startStreaming);
      Ember.addListener(search, 'data', this, this._handleResults);
      Ember.addListener(search, 'done', this, this._endFetch);
    }
  }.observes('search'),

  _handleResults: function(search, e, results){
    if (results.length) {
      this.set('hasData', true);
      this.incrementProperty('total', results.length);
    }
  },

  _startFetch: function(search){
    this.set('status', 'searching');
  },

  _startStreaming: function(search){
    this.set('status', 'streaming');
  },

  _endFetch: function(search, e) {
    if (this.get('hasData')) {
      this.set('status', 'completed');
    } else {
      this.set('status', 'no results');
    }

    this.set('hasMorePages', search.hasMorePages());
  }
});
