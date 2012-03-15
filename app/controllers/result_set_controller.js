IWitness.resultSetController = Ember.ArrayController.create(IWitness.ResultSorting, {
  content: [],
  selectedResult: null,
  isDone: false,
  stopped: false,

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
  }

});

