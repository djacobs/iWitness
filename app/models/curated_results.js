IWitness.CuratedResults = function(){
  this.results = {};
};

_.extend(IWitness.CuratedResults.prototype, {

  addResult: function(result) {
    this.results[result.get('resultId')] = result;
  },

  removeResult: function(result) {
    delete this.results[result.get('resultId')];
  },

  contains: function(resultId) {
    return this.results.hasOwnProperty(resultId);
  }

});
