IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_view',
  location: '39.76395,-86.1656,1km',

  search: function(e) {
    Twitter.search(
      this.getProperties('location', 'keyword'),
      function(results){
        IWitness.ResultsetController.set('content', results);
      }
    );
  }
});
