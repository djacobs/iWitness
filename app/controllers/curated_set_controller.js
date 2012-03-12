IWitness.curatedSetController = Ember.ArrayController.create({
  content: [],
  _resultIds: [],

  toggleCuration: function(result) {
    if(this.isCurated(result)) {
      this._removeResult(result);
    } else {
      this._addResult(result);
    }
  },

  isCurated: function(result) {
    return _.indexOf(this._resultIds, result.get('resultId')) > -1;
  },

  _addResult: function(result){
    this._resultIds.push(result.get('resultId'));
    this.pushObject(result);
  },

  _removeResult: function(result){
    var id = result.get('resultId');
    this._resultIds = _.without(this._resultIds, id);
    var curatedResult = this.find( function(item) {
      return id == item.get('resultId');
    });
    this.removeObject(curatedResult);
  }
});
