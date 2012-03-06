IWitness.resultSetController = Ember.ArrayController.create({
  content: [],
  selectedResult: null,
  isDone: false,
  pause: false,

  pushResults: function(type, results){
    if (this.get('pause')) return;
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
    this.set('pause', true);
  },

  unpause: function(){
    this.set('pause', false);
  },

  _findInsertionPoint: function(obj) {
    var idx = 0;
    var len = this.get("length");
    if (len === 0) return 0;

    var comp = Ember.compare(obj, this.objectAt(idx));
    while (comp > 0 && idx < len) {
      idx++;
      comp = Ember.compare(obj, this.objectAt(idx));
    }
    if (comp === 0) return null;
    return idx;
  }
});
