IWitness.curatedSetController = Ember.ArrayController.create({
  content: [],
  _resultIds: [],

  init: function() {
    this._super();
    for (var key in localStorage) {
      if(this._isKey(key)) {
        var obj = JSON.parse(localStorage[key]);
        var result = IWitness.resultFactory.create(obj.resultType, obj);
        this._addResult(result);
      }
    }
  },

  toggleCuration: function(result) {
    if(this.isCurated(result)) {
      this._removeResult(result);
      delete localStorage[this._key(result)];
    } else {
      this._addResult(result);

      localStorage[this._key(result)] = result.serialize();
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
  },

  _key: function(result){
    return 'curated_' + result.get('resultId');
  },

  _isKey: function(key) {
    return key.substring(0,8) == 'curated_';
  }
});
