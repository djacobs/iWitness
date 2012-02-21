IWitness.resultSetController = Ember.ArrayController.create({
  content: [],
  selectedResult: null,

  sortedContent: function() {
    var sorted = Ember.copy(this.get("content"), false);
    sorted.sort(function(a,b) {
      if (a.get("postedMoment").isBefore(b.get("postedMoment"))) {
        return 1;
      } else {
        return -1;
      }
    });
    return sorted;
  }.property("@each").cacheable(),

  pushResults: function(type, results){
    var objects = results.map(function(result) {
      return IWitness.resultFactory.create(type, result);
    });
    this.pushObjects(objects);
  },

  clearResults: function() {
    this.set('content', []);
    this.set('selectedResult', null);
  }
});
