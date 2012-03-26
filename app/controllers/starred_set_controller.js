IWitness.starredSetController = Ember.ArrayController.create(IWitness.ResultSorting, {
  content: [],
  _resultIds: [],

  init: function() {
    var self = this;

    this._super();

    StarredResultsCache.forEach(function(result) {
      self._addResult(result);
    });
  },

  isEmpty: function() {
    return this.getPath('content.length') == 0;
  }.property('content.length'),

  toggleCuration: function(result) {
    if(this.isStarred(result)) {
      this._removeResult(result);
      StarredResultsCache.remove(result);
    } else {
      this._addResult(result);
      StarredResultsCache.add(result);
    }
  },

  isStarred: function(result) {
    return _.indexOf(this._resultIds, result.get('resultId')) > -1;
  },

  clear: function(){
    if (confirm("Clear all starred results?")) {
      this.set('content', []);
      this.set('_resultIds', []);
      StarredResultsCache.clearAll();
    }
  },

  _addResult: function(result){
    var idx = this._findInsertionPoint(result);
    if (idx !== null) {
      this._resultIds.push(result.get('resultId'));
      this.insertAt(idx, result);
    }
  },

  _removeResult: function(result){
    var id = result.get('resultId');
    this._resultIds = _.without(this._resultIds, id);
    var starredResult = this.find( function(item) {
      return id == item.get('resultId');
    });
    this.removeObject(starredResult);
  },
});
