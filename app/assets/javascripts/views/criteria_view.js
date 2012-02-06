IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_view',
  location: '39.76395,-86.1656,1km',

  search: function(e) {
    var params = this.getProperties('location', 'keyword', 'start_time', 'end_time');
    var search = new TwitterSearch(params);

    search.fetchResults(function(results){
      IWitness.ResultsetController.set('content', results);
    });
  }
});
