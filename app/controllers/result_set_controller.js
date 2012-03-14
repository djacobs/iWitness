IWitness.resultSetController = Ember.ArrayController.create(IWitness.ResultSorting, {
  content: [],
  selectedResult: null,
  isDone: false,
  stopped: false,
  paused: false,
  hiddenItemsCount: 0,


  pushResults: function(type, results){
    if (this.get('stopped')) return;
    var self = this;
    this.set('isDone', false);

    results.forEach(function(result) {
      var result = IWitness.resultFactory.create(type, result);
      var idx = self._findInsertionPoint(result);
      if (idx !== null)
        self.insertAt(idx, result);
    });

    this.set('isDone', true);
  },

  clearResults: function() {
    this.set('content', []);
    this.set('selectedResult', null);
    this.set('stopped', true);
  },

  resume: function(){
    this.set('stopped', false);
  },

  pause: function(){
    this.set('paused', true);
  },

  unpause: function(){
    this.set('paused', false);
    this.set('hiddenItemsCount', 0);
  },

  hasHiddenItems: function(){
    return this.get('hiddenItemsCount') > 0;
  }.property('hiddenItemsCount')

});
