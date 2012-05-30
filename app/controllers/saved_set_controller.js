IWitness.savedSetController = Ember.ArrayController.create(IWitness.ResultSorting, {
  content:        [],
  _resultIds:     [],
  selectedResult: null,

  init: function() {
    var self = this;

    this._super();

    SavedResultsCache.forEach(function(result) {
      self._addResult(result);
    });
  },

  isEmpty: function() {
    return this.getPath('content.length') == 0;
  }.property('content.length'),

  toggleCuration: function(result) {
    if(this.isSaved(result)) {
      this._removeResult(result);
      SavedResultsCache.remove(result);
    } else {
      this._addResult(result);
      SavedResultsCache.add(result);
    }
  },

  isSaved: function(result) {
    return _.indexOf(this._resultIds, result.get('resultId')) > -1;
  },

  flaggedResults: function() {
    return this.filterProperty('flagged', true);
  }.property('content.@each.flagged'),

  flaggedCount: function() {
    return this.get('flaggedResults').length;
  }.property('flaggedResults'),

  clear: function(){
    if (confirm("Clear all saved results?")) {
      this.set('content', []);
      this.set('_resultIds', []);
      SavedResultsCache.clearAll();
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
    var savedResult = this.find( function(item) {
      return id == item.get('resultId');
    });
    this.removeObject(savedResult);
  }
});
