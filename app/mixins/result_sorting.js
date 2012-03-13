IWitness.ResultSorting = Ember.Mixin.create({
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
