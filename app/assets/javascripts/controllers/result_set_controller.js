IWitness.resultSetController = Ember.ArrayController.create({
  content: [],
  selectedResult: null,

  pushResults: function(type, results){
    var self = this;
    results.forEach(function(result) {
      var result = IWitness.resultFactory.create(type, result);
      var idx = self._findInsertionPoint(result);
      self.insertAt(idx, result);
    });
  },

  clearResults: function() {
    this.set('content', []);
    this.set('selectedResult', null);
  },

  sortFn: function(a,b) {
    if (!a || !b) return 1;
    if (a.get("postedMoment").isBefore(b.get("postedMoment"))) {
      return 1;
    } else {
      return -1;
    }
  },

  _findInsertionPoint: function(obj) {
    var idx = 0;
    var len = this.get("length");
    if (len === 0) return 0;

    var comp = this.sortFn(obj, this.objectAt(idx));
    while (comp > 0 && idx < len) {
      idx++;
      comp = this.sortFn(obj, this.objectAt(idx));
    }
    return idx;
  }
});
