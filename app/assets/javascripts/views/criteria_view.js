IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_view',
  location: '39.76395,-86.1656,1km',
  start_time: '1/31/12 5:30',
  end_time: '1/31/12 5:30',
  keyword: 'test',

  search: function(e) {
    var params = this.getProperties('location', 'keyword', 'start_time', 'end_time');
    var search = new TwitterSearch(params);

    IWitness.ResultsetController.set('content', []);
    search.bind('data', function(results){
      IWitness.ResultsetController.pushObjects(results);
    });
    search.perform();
  }
});
